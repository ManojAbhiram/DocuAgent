import { useState } from 'react';
import { TrendingUp, FileText, BarChart3, LockKeyhole } from 'lucide-react';

export default function FinancialAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const mockAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        kpis: {
          'Total Revenue': '$1.24M',
          'EBITDA': '$450k',
          'Net Profit Margin': '18.5%',
          'Operating Cash Flow': '$380k'
        },
        trends: [
          'Revenue shows a 14% quarter-over-quarter growth.',
          'EBITDA margins improved by 200bps driven by reduced cloud compute costs.',
          'Cash flow is steady but accounts receivable cycle increased by 5 days.'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Financial Analyzer</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Secure KPI extraction and trend summarization.</p>
        </header>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Financial Document</h3>
            <span className="flex items-center text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-full font-medium">
              <LockKeyhole className="w-3 h-3 mr-1" />
              Fully Masked for LLM
            </span>
          </div>
          <textarea 
            className="w-full h-64 p-4 text-sm bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-all"
            placeholder="Paste financial transcript or summary here..."
            defaultValue="Q3 Financial Highlights: Total revenue for the quarter was $1.24M, reflecting strong SaaS renewals. Our EBITDA reached $450k, generating a net profit margin of 18.5%. Operating Cash flow stands at $380k."
          />
          <button 
            onClick={mockAnalyze}
            disabled={isAnalyzing}
            className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Extracting Summaries Securely...
              </span>
            ) : (
              <span className="flex items-center">
                <FilterDataIcon className="w-5 h-5 mr-2" /> Extract KPIs & Insights
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
                <BarChart3 className="w-5 h-5 mr-2 text-indigo-500" /> Key Performance Indicators
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(result.kpis).map(([key, val], i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-dark-900 rounded-xl border border-slate-100 dark:border-dark-700">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{key}</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center mb-4">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-500" /> Secure AI Trend Insights
              </h3>
              <ul className="space-y-3">
                {result.trends.map((trend, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-700 dark:text-slate-300 p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-lg">
                    <span className="text-indigo-500 mr-2 font-bold">•</span> {trend}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-dark-700 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Submit financial text to generate<br />KPIs and Insights securely.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterDataIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  )
}
