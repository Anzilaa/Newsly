import { useState } from "react";
import {
  FileText,
  Link as LinkIcon,
  FileImage,
  Sparkles,
  AlertCircle,
  Upload,
  X,
  Loader2,
  Compass,
  Activity,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const DEFAULT_REJECTION_MSG =
  "Unable to classify this text. Please enter a valid news article or headline.";

export default function Classify() {
  const [inputType, setInputType] = useState("text"); // text, url, pdf
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [result, setResult] = useState(null);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (
        file.type === "application/pdf" ||
        file.name.endsWith(".pdf") ||
        file.type.startsWith("text/")
      ) {
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
        ? data.extracted_text.slice(0, 100) +
          (data.extracted_text.length > 100 ? "..." : "")
        : "No preview available";

      const newEntry = {
        id: Date.now(),
        preview: previewText,
        category: data.category,
        inputType: typeUsed.toUpperCase(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      const existing = JSON.parse(
        localStorage.getItem("newsly_history") || "[]",
      );
      localStorage.setItem(
        "newsly_history",
        JSON.stringify([newEntry, ...existing]),
      );
    } catch (err) {
      console.error("Failed to save to history:", err);
    }
  };

  const handleClassify = async () => {
    setError(null);

    if (inputType === "pdf" && selectedFile) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(`${API_BASE_URL}/classify-file`, {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || DEFAULT_REJECTION_MSG);
        }

        processSuccess(data, "PDF");
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
        text: inputType === "url" ? null : content,
        url: inputType === "url" ? content : null,
      };

      const response = await fetch(`${API_BASE_URL}/classify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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

    setExtractedText(data.extracted_text || "");
    saveToHistory(data, typeUsed);
  };

  return (
    <div className="max-w-6xl mx-auto pb-8 space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Classification Workspace
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
          Classify News Article
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Analyze text content, web article URLs, or uploaded PDF documents in
          real-time.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm shadow-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Top Row: Input & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column - Input Box */}
          <div className="flex flex-col h-full space-y-4">
            {/* Input Type Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Select Input Source
                </label>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <InputTypeButton
                  active={inputType === "text"}
                  onClick={() => {
                    setInputType("text");
                    setError(null);
                  }}
                  icon={<FileText className="w-4 h-4" />}
                  label="Text Article"
                />
                <InputTypeButton
                  active={inputType === "url"}
                  onClick={() => {
                    setInputType("url");
                    setError(null);
                  }}
                  icon={<LinkIcon className="w-4 h-4" />}
                  label="Web Link"
                />
                <InputTypeButton
                  active={inputType === "pdf"}
                  onClick={() => {
                    setInputType("pdf");
                    setError(null);
                  }}
                  icon={<FileImage className="w-4 h-4" />}
                  label="PDF Document"
                />
              </div>
            </div>

            {/* Content Textarea */}
            <div className="flex-1 flex flex-col">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Content Payload
              </label>
              <div className="bg-white dark:bg-[#14161F] rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-xs p-3 flex-1 flex flex-col justify-between">
                {inputType === "pdf" ? (
                  <div className="p-2 flex-1 flex flex-col justify-center">
                    {selectedFile ? (
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[#1C1F2B] border border-slate-200 dark:border-white/10 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <FileImage className="w-5 h-5 shrink-0" />
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleRemoveFile}
                          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-emerald-500/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 dark:bg-[#181A24]/60 flex-1">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 mb-3">
                          <Upload className="w-6 h-6" />
                        </div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm text-center">
                          Upload PDF document
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          Drag & drop or click to browse
                        </p>
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1.5">
                        Or paste PDF text directly:
                      </p>
                      <textarea
                        className="w-full p-3 bg-slate-50 dark:bg-[#181A24] border border-slate-200/60 dark:border-white/5 rounded-xl outline-none resize-none text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 min-h-18 focus:border-emerald-500/40"
                        placeholder="Paste plain text here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <textarea
                    className="w-full flex-1 p-3.5 bg-slate-50/70 dark:bg-[#181A24]/60 rounded-xl border border-slate-100 dark:border-white/5 outline-none resize-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm min-h-40 focus:border-emerald-500/40 font-sans"
                    placeholder={
                      inputType === "text"
                        ? "Paste news article headline or text snippet..."
                        : inputType === "url"
                          ? "Enter full news article URL (e.g., https://...)..."
                          : "Paste text content here..."
                    }
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                )}

                <div className="flex justify-between items-center px-1 pt-2 pb-1">
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                    {content.length} chars
                  </span>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleClassify}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 py-3 rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Features...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Classify News Article</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results Card */}
          <div className="bg-white dark:bg-[#14161F] rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 shadow-xs flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" /> Category
                  Output
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  SVM Engine
                </span>
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-slate-50 dark:bg-[#181A24] rounded-2xl p-7 border border-slate-200/80 dark:border-white/5 flex-1 flex flex-col items-center justify-center text-center my-2 relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-500 shadow-xs">
                <Compass className="w-7 h-7 text-emerald-500" />
              </div>

              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 mb-1.5">
                Predicted Topic Category
              </span>

              <h3 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
                {result ? result.category : "—"}
              </h3>

              {result && (
                <>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                    Evaluated as {result.category} category across TF-IDF
                    feature dimensions.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    High Margin Classification
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Row: Extracted Text Preview */}
        <div className="w-full">
          <div className="bg-white dark:bg-[#14161F] rounded-2xl border border-slate-200/80 dark:border-white/5 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Extracted Text Content</span>
              </div>
              {extractedText && (
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {extractedText.split(/\s+/).filter(Boolean).length} words
                  extracted
                </span>
              )}
            </div>
            <div className="p-4 bg-slate-50/80 dark:bg-[#181A24] rounded-xl border border-slate-200/60 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 min-h-16 max-h-48 overflow-y-auto font-sans">
              {extractedText ? (
                <p className="whitespace-pre-wrap leading-relaxed">
                  {extractedText}
                </p>
              ) : (
                <p className="italic text-slate-400 dark:text-slate-500 text-xs">
                  No article content extracted yet.
                </p>
              )}
            </div>
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
      className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
        active
          ? "bg-white dark:bg-[#1C1F2B] border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
          : "bg-slate-100/70 dark:bg-[#14161F] border-slate-200/80 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-[#1C1F2B]"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
