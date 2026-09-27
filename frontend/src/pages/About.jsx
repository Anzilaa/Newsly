import { 
  FileText, 
  Database, 
  TrendingUp
} from 'lucide-react';

export default function About() {
  const metrics = [
    { 
      label: 'Overall Accuracy', 
      value: '87.6%', 
      badge: '+87.6% Test Score', 
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      strokeColor: 'text-emerald-500',
      sparkline: "M0 35 Q 25 30, 50 15 T 100 5 T 150 20 T 200 2" 
    },
    { 
      label: 'Weighted Precision', 
      value: '88.2%', 
      badge: '+88.2% Precision', 
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      strokeColor: 'text-amber-500',
      sparkline: "M0 30 Q 30 10, 70 25 T 130 10 T 200 5" 
    },
    { 
      label: 'Sensitivity (Recall)', 
      value: '87.6%', 
      badge: '+87.6% Recall', 
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      strokeColor: 'text-purple-500',
      sparkline: "M0 38 Q 40 25, 80 18 T 140 12 T 200 4" 
    },
    { 
      label: 'F1-Score Metric', 
      value: '87.8%', 
      badge: '+87.8% F1 Balance', 
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      strokeColor: 'text-emerald-500',
      sparkline: "M0 25 Q 35 35, 75 12 T 135 20 T 200 3" 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-8 space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">About Newsly</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          A machine learning based news categorization system evaluating article text, URLs, and PDF documents.
        </p>
      </div>

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* What is Newsly? */}
        <div className="md:col-span-2 bg-white dark:bg-[#14161F] rounded-2xl border border-slate-200/80 dark:border-white/5 p-7 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-100 dark:bg-[#1C1F2B] rounded-xl text-emerald-600 dark:text-emerald-400 border border-slate-200/60 dark:border-white/5">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">What is Newsly?</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            Newsly is a machine learning text classification system that categorizes news articles into predefined topic domains. By processing text input, URL articles, or PDF documents, Newsly extracts article content, computes feature vectors, and predicts category scores with high accuracy.
          </p>
        </div>

        {/* Dataset */}
        <div className="bg-white dark:bg-[#14161F] rounded-2xl border border-slate-200/80 dark:border-white/5 p-7 shadow-xs">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-slate-100 dark:bg-[#1C1F2B] rounded-xl text-emerald-600 dark:text-emerald-400 border border-slate-200/60 dark:border-white/5">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Dataset Summary</h2>
          </div>
          <ul className="space-y-2.5 text-slate-600 dark:text-slate-300 text-sm">
            <li className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>106,280 news articles</span>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>35 news categories</span>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Full article body & headlines</span>
            </li>
            <li className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span>Balanced multi-class distribution</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Evaluation Metrics Benchmark
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-[#14161F] rounded-2xl p-5 border border-slate-200/80 dark:border-white/5 relative overflow-hidden flex flex-col justify-between transition-all hover:border-slate-300 dark:hover:border-white/10 shadow-xs"
            >
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{m.label}</div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white font-mono tracking-tight mb-2">
                  {m.value}
                </div>
                <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md border ${m.badgeColor}`}>
                  {m.badge}
                </span>
              </div>

              {/* Clean SVG Sparkline */}
              <div className="mt-6 pt-2 relative h-12 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <path
                    d={m.sparkline}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={`${m.strokeColor} transition-all duration-300`}
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
