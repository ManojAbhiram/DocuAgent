import { useState, useEffect } from 'react';
import { AlertCircle, FileText, Check, Loader2, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function ContractAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/documents/');
      // Only show completed contracts
      const contracts = res.data.filter(d => d.status === 'Completed' && (d.doc_type === 'Contract' || d.doc_type === 'General'));
      setDocuments(contracts);
      if (contracts.length > 0) setSelectedDocId(contracts[0].id);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedDocId) return;
    setIsAnalyzing(true);
    setError('');
    try {
      const res = await axios.post('/analyzers/contract', { document_id: parseInt(selectedDocId) });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contract Analyzer</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Secure AI analysis of legal documents from your processing queue.</p>
        </header>

        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Select Document</h3>
          
          <div className="relative mb-6">
            <select 
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full p-3 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-xl text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none appearance-none transition-all"
            >
              {documents.length === 0 ? (
                <option value="">No completed documents found...</option>
              ) : (
                documents.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.filename} (#{doc.id})</option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !selectedDocId}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Analyzing via Secure LLM...
              </span>
            ) : (
              <span className="flex items-center">
                <FileText className="w-5 h-5 mr-2" /> Run AI Analysis
              </span>
            )}
          </button>
          
          <p className="text-xs text-slate-400 mt-4 text-center">
            Only "Completed" documents are available for analysis.
          </p>
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
              <div className="text-3xl font-bold text-orange-500">{result.risk_score || result.riskScore || 0}/100</div>
            </div>

            <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-primary-500" /> Extracted Clauses
              </h3>
              <div className="space-y-4">
                {(result.clauses || []).map((clause, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-dark-900 rounded-xl border border-slate-100 dark:border-dark-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-200">{clause.type || clause.clause_type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${clause.risk === 'Low' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {clause.risk} Risk
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{clause.text || clause.content}</p>
                  </div>
                ))}
              </div>

              {result.deadlines && result.deadlines.length > 0 && (
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
              )}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-dark-700 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 text-center">
              Select a processed document to see the<br />AI analysis results.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
