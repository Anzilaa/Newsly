import { useState } from "react";
import { Search, Trash2, Clock } from "lucide-react";

export default function History() {
  const [historyItems, setHistoryItems] = useState(() => {
    try {
      const stored = localStorage.getItem("newsly_history");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error("Failed to load history:", e);
      return [];
    }
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInputType, setSelectedInputType] = useState("ALL");

  const handleDelete = (id) => {
    const updated = historyItems.filter((item) => item.id !== id);
    setHistoryItems(updated);
    localStorage.setItem("newsly_history", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistoryItems([]);
      localStorage.removeItem("newsly_history");
    }
  };

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      selectedInputType === "ALL" || item.inputType === selectedInputType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-6xl mx-auto pb-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Activity Log
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
            Classification History
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            View, search, and manage your classified news articles and
            headlines.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Filter history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-[#14161F] border border-slate-200/80 dark:border-white/5 rounded-xl text-xs text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500/40 w-full md:w-56 shadow-xs font-sans"
            />
          </div>

          <div className="relative">
            <select
              value={selectedInputType}
              onChange={(e) => setSelectedInputType(e.target.value)}
              className="px-3.5 py-2 bg-white dark:bg-[#14161F] border border-slate-200/80 dark:border-white/5 rounded-xl text-xs text-slate-700 dark:text-slate-300 outline-none focus:border-emerald-500/40 cursor-pointer shadow-xs font-medium"
            >
              <option value="ALL">All Sources</option>
              <option value="TEXT">Text</option>
              <option value="URL">URL</option>
              <option value="PDF">PDF</option>
            </select>
          </div>

          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/40 rounded-xl text-xs font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#14161F] rounded-2xl border border-slate-200/80 dark:border-white/5 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-[#181A24]">
                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Article Preview
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Category Output
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Input Source
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="hover:bg-slate-50/70 dark:hover:bg-[#181A24]/60 transition-colors"
                  >
                    <td className="px-6 py-4 text-xs font-mono text-slate-400 dark:text-slate-500">
                      {index + 1}
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200 max-w-md truncate font-sans"
                      title={item.preview}
                    >
                      {item.preview}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono bg-slate-100 dark:bg-[#1D202B] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                        {item.inputType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {item.date}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
                        {item.time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-14 text-center text-slate-500 dark:text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-[#181A24] rounded-2xl border border-slate-200/60 dark:border-white/5 flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        No records found
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        Classify articles to see history logs here.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
