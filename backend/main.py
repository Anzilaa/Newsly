from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import re
import numpy as np
from typing import Optional
import httpx
from bs4 import BeautifulSoup
import io
import pypdf

app = FastAPI(title="Newsly API")

# Setup CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models on startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "news_svm_model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "models", "tfidf_vectorizer.pkl")

# Load globally so they stay in memory
try:
    svm_model = joblib.load(MODEL_PATH)
    tfidf_vectorizer = joblib.load(VECTORIZER_PATH)
    print("Models loaded successfully.")
except Exception as e:
    print(f"Failed to load models: {e}")
    svm_model = None
    tfidf_vectorizer = None

class ClassifyRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None
    input_type: Optional[str] = "text"  # "text", "url", "pdf"

class ClassifyResponse(BaseModel):
    category: str
    extracted_text: str

REJECTION_MESSAGE = "Unable to classify this text. Please enter a valid news article or headline."

async def extract_text_from_url(url: str) -> str:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)
        
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer", "header", "aside"]):
            script.extract()
        
        # Extract paragraph text or body text
        paragraphs = [p.get_text().strip() for p in soup.find_all("p")]
        text = " ".join([p for p in paragraphs if p])
        
        if not text or len(text) < 20:
            text = soup.get_text()
            text = re.sub(r'\s+', ' ', text).strip()
            
        if not text:
            raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)
            
        return text

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    try:
        reader = pypdf.PdfReader(io.BytesIO(pdf_bytes))
        extracted = []
        for page in reader.pages:
            t = page.extract_text()
            if t:
                extracted.append(t)
        text = " ".join(extracted).strip()
        text = re.sub(r'\s+', ' ', text)
        if not text:
            raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)
        return text
    except Exception:
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)

def predict_category(text: str) -> str:
    if svm_model is None or tfidf_vectorizer is None:
        raise HTTPException(status_code=500, detail="Models are not loaded.")

    # Stage 1: Basic text structure and character validation
    clean_text = text.strip()
    if len(clean_text) < 3:
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)
    
    alpha_chars = sum(1 for c in clean_text if c.isalpha())
    non_space_chars = sum(1 for c in clean_text if not c.isspace())
    if non_space_chars == 0 or (alpha_chars / non_space_chars) < 0.40:
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)

    # Stage 2: TF-IDF feature vocabulary overlap check
    features = tfidf_vectorizer.transform([clean_text])
    if features.nnz == 0:
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)

    # Stage 3: LinearSVC decision margin evidence check
    scores = svm_model.decision_function(features)[0]
    sorted_scores = np.sort(scores)[::-1]
    top1 = sorted_scores[0]
    top2 = sorted_scores[1]
    margin = top1 - top2

    if margin < 0.03:
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)
    if features.nnz < 4 and margin < 0.30:
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)

    pred = svm_model.predict(features)[0]
    return str(pred)

@app.post("/classify", response_model=ClassifyResponse)
async def classify_news(request: ClassifyRequest):
    input_text = (request.text or "").strip()
    
    if request.input_type == "url" or (input_text.startswith("http://") or input_text.startswith("https://")):
        url = request.url or input_text
        if not url:
            raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)
        input_text = await extract_text_from_url(url)
    
    if not input_text:
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)

    category = predict_category(input_text)
    
    return ClassifyResponse(
        category=category,
        extracted_text=input_text
    )

@app.post("/classify-file", response_model=ClassifyResponse)
async def classify_file(file: UploadFile = File(...)):
    content = await file.read()
    filename = file.filename.lower()
    
    if filename.endswith(".pdf"):
        extracted_text = extract_text_from_pdf_bytes(content)
    else:
        try:
            extracted_text = content.decode("utf-8")
        except Exception:
            raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)
            
    if not extracted_text or not extracted_text.strip():
        raise HTTPException(status_code=400, detail=REJECTION_MESSAGE)

    category = predict_category(extracted_text)

    return ClassifyResponse(
        category=category,
        extracted_text=extracted_text
    )

@app.get("/")
async def root():
    return {"message": "Newsly API is running"}
