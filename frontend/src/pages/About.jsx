import { FileText, Database, Settings, ArrowRight, Link as LinkIcon, FileImage, Edit3, CheckCircle, CheckSquare, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif tracking-tight">About Newsly</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          A machine learning based news categorization system.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* What is Newsly? */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">What is Newsly?</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Newsly is a web application that classifies news articles into predefined categories using natural language processing and machine learning. You can paste a news article, provide a link, or upload a PDF, and the system will predict the most relevant category.
          </p>
        </div>

        {/* Dataset */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Database className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Dataset</h2>
          </div>
          <ul className="space-y-3 text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>106,280 news articles</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>35 categories</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>Full article text</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <span>Real-world news data</span>
            </li>
          </ul>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Settings className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">How it works</h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 w-full">
          <ProcessStep icon={<FileText className="w-6 h-6" />} title="Input" desc="Text, URL, or PDF" />
          <ProcessArrow />
          <ProcessStep icon={<LinkIcon className="w-6 h-6" />} title="Text Extraction" desc="Extract article content" />
          <ProcessArrow />
          <ProcessStep icon={<Settings className="w-6 h-6" />} title="Preprocessing" desc="Clean and prepare text" />
          <ProcessArrow />
          <ProcessStep icon={<CheckSquare className="w-6 h-6" />} title="TF-IDF" desc="Convert text to features" />
          <ProcessArrow />
          <ProcessStep icon={<Edit3 className="w-6 h-6" />} title="SVM Classifier" desc="Predict category" />
          <ProcessArrow />
          <ProcessStep icon={<CheckCircle className="w-6 h-6" />} title="Output" desc="Category with confidence" />
        </div>
      </div>

    </div>
  );
}

function ProcessStep({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center max-w-[120px]">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 shadow-sm">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  );
}

function ProcessArrow() {
  return (
    <>
      <div className="hidden lg:flex text-slate-300 dark:text-slate-700">
        <ArrowRight className="w-5 h-5" />
      </div>
      <div className="flex lg:hidden text-slate-300 dark:text-slate-700 my-2">
        <ArrowRight className="w-5 h-5 rotate-90" />
      </div>
    </>
  );
}
