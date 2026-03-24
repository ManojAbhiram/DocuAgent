import { useState } from 'react';
import { AlertCircle, FileText, Check } from 'lucide-react';

export default function ContractAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const mockAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setResult({
        riskScore: 78,
        clauses: [
          { type: 'Termination', text: 'Either party may terminate this agreement with 30 days notice.', risk: 'Low' },
          { type: 'Liability', text: 'Total liability shall not exceed the amount paid in the preceding 12 months.', risk: 'Medium' }
        ],
        deadlines: ['2027-01-01 (Renewal)']
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contract Analyzer</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Secure AI analysis of legal documents.</p>
        </header>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Input Document</h3>
          <textarea 
            className="w-full h-64 p-4 text-sm bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none resize-none transition-all"
            placeholder="Paste contract text here..."
            defaultValue="This agreement is made between [ORG_1] and [ORG_2]. Either party may terminate this agreement with 30 days notice. Total liability shall not exceed the amount paid in the preceding 12 months. The renewal date is 2027-01-01."
          />
          <button 
            onClick={mockAnalyze}
            disabled={isAnalyzing}
            className="mt-4 w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing via Secure LLM...
              </span>
            ) : (
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2" /> Extract Clauses
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Overall Risk Score</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Calculated based on standard liabilities.</p>
              </div>
              <div className="text-3xl font-bold text-orange-500">{result.riskScore}/100</div>
            </div>

            <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary-500" /> Extracted Clauses
              </h3>
              <div className="space-y-4">
                {result.clauses.map((clause, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-dark-900 rounded-xl border border-slate-100 dark:border-dark-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{clause.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${clause.risk === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {clause.risk} Risk
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{clause.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-dark-700">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Deadlines Alert</h4>
                <ul className="space-y-2">
                  {result.deadlines.map((date, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                      <Check className="w-4 h-4 text-emerald-500 mr-2" /> {date}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-dark-700 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Submit a document to see the<br />AI analysis results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
