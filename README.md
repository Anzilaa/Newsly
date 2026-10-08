# 📰 Newsly

## ✨ Project Summary
Newsly is a full-stack news topic classification app that predicts categories from typed text, article URLs, and uploaded PDF content. The frontend provides a clean workspace for classification and local history management, while the FastAPI backend handles extraction, validation, and SVM inference.

## 🧩 Feature Architecture

| Feature Name | How It Works (Brief Description) | File Path | Exact Line Range |
|---|---|---|---|
| App route shell | Defines `/classify`, `/history`, `/about`, and redirects `/` to `/classify`. | `frontend/src/App.jsx` | `1-22` |
| Layout + theme toggle | Renders responsive sidebar/topbar shell and persists dark mode in `localStorage`. | `frontend/src/components/Layout.jsx` | `14-135` |
| Text/URL/PDF classify workspace | Manages input modes, API requests, result state, and extracted text preview UI. | `frontend/src/pages/Classify.jsx` | `19-404` |
| Classification history persistence | Saves classification preview/category/source/time entries to `newsly_history`. | `frontend/src/pages/Classify.jsx` | `50-83` |
| History view + filtering | Loads history, filters by query/source, and supports item/all deletion. | `frontend/src/pages/History.jsx` | `4-191` |
| About + model metrics dashboard | Displays model overview, dataset summary, and benchmark metric cards. | `frontend/src/pages/About.jsx` | `7-140` |
| URL text extraction | Fetches article HTML, strips non-content nodes, and returns cleaned text. | `backend/main.py` | `51-77` |
| PDF byte extraction | Reads uploaded PDF bytes and normalizes extracted text. | `backend/main.py` | `79-94` |
| Prediction validation pipeline | Applies input checks, TF-IDF overlap checks, and SVM margin gates before prediction. | `backend/main.py` | `95-127` |
| JSON classification endpoint | Classifies text/URL requests and returns category + extracted text payload. | `backend/main.py` | `129-147` |
| File classification endpoint | Accepts uploaded files, decodes/extracts text, and classifies content. | `backend/main.py` | `149-170` |
| API health endpoint | Returns service status payload for root route requests. | `backend/main.py` | `172-174` |

## 🛠️ Technical Stack
- `Python` • `FastAPI` • `scikit-learn` • `NumPy` • `httpx` • `BeautifulSoup` • `pypdf`
- `JavaScript (ESM)` • `React` • `React Router` • `Vite` • `Tailwind CSS` • `lucide-react`
