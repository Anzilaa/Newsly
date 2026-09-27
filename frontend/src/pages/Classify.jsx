import { useState } from 'react';
import { FileText, Link as LinkIcon, FileImage, Sparkles, AlertCircle, Upload, X, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const DEFAULT_REJECTION_MSG = "Unable to classify this text. Please enter a valid news article or headline.";

export default function Classify() {
  const [inputType, setInputType] = useState('text'); // text, url, pdf
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [result, setResult] = useState(null);
  const [extractedText, setExtractedText] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.type.startsWith('text/')) {
        setSelectedFile(file);
        setError(null);
      } else {
        setError(DEFAULT_REJECTION_MSG);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const saveToHistory = (data, typeUsed) => {
    try {
      const previewText = data.extracted_text
        ? data.extracted_text.slice(0, 100) + (data.extracted_text.length > 100 ? '...' : '')
        : 'No preview available';

      const newEntry = {
        id: Date.now(),
        preview: previewText,
        category: data.category,
        inputType: typeUsed.toUpperCase(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const existing = JSON.parse(localStorage.getItem('newsly_history') || '[]');
      localStorage.setItem('newsly_history', JSON.stringify([newEntry, ...existing]));
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  };

  const handleClassify = async () => {
    setError(null);

    if (inputType === 'pdf' && selectedFile) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch(`${API_BASE_URL}/classify-file`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || DEFAULT_REJECTION_MSG);
        }

        processSuccess(data, 'PDF');
      } catch (err) {
        setError(err.message || DEFAULT_REJECTION_MSG);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!content.trim()) {
      setError(DEFAULT_REJECTION_MSG);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        input_type: inputType,
        text: inputType === 'url' ? null : content,
        url: inputType === 'url' ? content : null,
      };

      const response = await fetch(`${API_BASE_URL}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || DEFAULT_REJECTION_MSG);
      }

      processSuccess(data, inputType);
    } catch (err) {
      setError(err.message || DEFAULT_REJECTION_MSG);
    } finally {
      setLoading(false);
    }
  };

  const processSuccess = (data, typeUsed) => {
    setResult({
      category: data.category,
    });

    setExtractedText(data.extracted_text || '');
    saveToHistory(data, typeUsed);
  };

  return (
    <div className="max-w-6xl mx-auto pb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">Classify News</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-base">
          Paste a news article, share a link, or upload a PDF and let AI tell you what it's about.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Top Row: Input and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Column - Input */}
          <div className="flex flex-col h-full">
            
            {/* Input Type Selection */}
            <div className="mb-4">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">1. Choose Input Type</h2>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <InputTypeButton 
                  active={inputType === 'text'} 
                  onClick={() => { setInputType('text'); setError(null); }} 
                  icon={<FileText className="w-4 h-4" />} 
                  label="Text" 
                />
                <InputTypeButton 
                  active={inputType === 'url'} 
                  onClick={() => { setInputType('url'); setError(null); }} 
                  icon={<LinkIcon className="w-4 h-4" />} 
                  label="URL" 
                />
                <InputTypeButton 
                  active={inputType === 'pdf'} 
                  onClick={() => { setInputType('pdf'); setError(null); }} 
                  icon={<FileImage className="w-4 h-4" />} 
                  label="PDF" 
                />
              </div>
            </div>

            {/* Content Input Area */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-2">2. Enter News Content</h2>
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-2 flex-1 flex flex-col">
                
                {inputType === 'pdf' ? (
                  <div className="p-3 flex-1 flex flex-col justify-center">
                    {selectedFile ? (
                      <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileImage className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                          <div className="truncate">
                            <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{selectedFile.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                        <button onClick={handleRemoveFile} className="p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800/50 rounded-lg transition-colors">
                          <X className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors flex-1">
                        <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                        <p className="font-medium text-slate-900 dark:text-white text-sm text-center">Click to upload or drag & drop PDF</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Supports .pdf files</p>
                        <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleFileChange} />
                      </label>
                    )}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Or paste text from PDF below:</p>
                      <textarea
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg outline-none resize-none text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 min-h-[4rem]"
                        placeholder="Paste PDF text here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    className="w-full flex-1 p-3 bg-transparent outline-none resize-none text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 text-sm min-h-[9rem]"
                    placeholder={
                      inputType === 'text' ? 'Paste your news article or headline here...' :
                      inputType === 'url' ? 'Paste news article URL here (e.g. https://news.example.com/article)...' :
                      'Upload PDF or paste content here...'
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                )}

                <div className="flex justify-between items-center px-3 pb-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{content.length}/5000</span>
                </div>
                <div className="px-2 pb-2">
                  <button 
                    onClick={handleClassify}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 dark:disabled:bg-indigo-900/50 text-white py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Classifying...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Classify News
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Results */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col h-full">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Classification Result</h2>

            {/* Main Result Area */}
            <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">
                Predicted Category
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {result ? result.category : '—'}
              </h3>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 max-w-sm">
                {result 
                  ? `The model has classified this article into ${result.category}.` 
                  : 'Submit a news article to see the predicted category.'}
              </p>
            </div>

          </div>

        </div>

        {/* Bottom Row: Extracted Text Preview (Full Width) */}
        <div className="w-full">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold mb-2 text-base">
              <FileText className="w-4 h-4 text-indigo-500" />
              <h3>Extracted Text Preview</h3>
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 min-h-[3rem] max-h-[12rem] overflow-y-auto">
              {extractedText ? (
                <p className="whitespace-pre-wrap leading-relaxed">{extractedText}</p>
              ) : (
                <p className="italic text-slate-400 dark:text-slate-600">No text extracted yet...</p>
              )}
            </div>
            {extractedText && (
              <div className="mt-2 text-right text-xs text-slate-400 dark:text-slate-500">
                {extractedText.split(/\s+/).filter(Boolean).length} words
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InputTypeButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-sm font-medium transition-all border cursor-pointer ${
        active 
          ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
