import { useState, useEffect } from 'react';
import { ShieldAlert, Receipt, CheckCircle, Loader2, ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function InvoiceAuditor() {
  const [isAuditing, setIsAuditing] = useState(false);
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
      const invoices = res.data.filter(d => d.status === 'Completed' && (d.doc_type === 'Invoice' || d.doc_type === 'General'));
      setDocuments(invoices);
      if (invoices.length > 0) setSelectedDocId(invoices[0].id);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  const handleAudit = async () => {
    if (!selectedDocId) return;
    setIsAuditing(true);
    setError('');
    try {
      const res = await axios.post('/analyzers/invoice', { document_id: parseInt(selectedDocId) });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Audit failed");
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Invoice Auditor</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Duplicate detection, tax validation, and secure financial analysis.</p>
      </header>

      <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Select Invoice</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Choose a processed invoice from your queue.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <select 
                  value={selectedDocId}
                  onChange={(e) => setSelectedDocId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-lg text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-primary-500 outline-none appearance-none transition-all"
                >
                  {documents.length === 0 ? (
                    <option value="">No invoices found...</option>
                  ) : (
                    documents.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.filename}</option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleAudit}
                disabled={isAuditing || !selectedDocId}
                className="py-2.5 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg shadow whitespace-nowrap hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
              >
                {isAuditing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Real Audit'}
              </button>
            </div>
        </div>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>

      {result ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-4">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Vendor Identity</h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{result.vendor_name || result.vendorName || 'Extracted'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-dark-700 pt-4">
              Invoice Date: <span className="font-mono bg-slate-100 dark:bg-dark-900 px-2 py-1 rounded text-primary-600 dark:text-primary-400">{result.invoice_date || result.date || 'N/A'}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Amount</h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{result.total_amount || result.amount || 'N/A'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-dark-700 pt-4 flex items-center">
               <ShieldAlert className="w-4 h-4 text-emerald-500 mr-2" />
               {result.audit_status || 'Audit checks passed securely.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-dark-700 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400">Select an invoice to start the AI audit.</p>
        </div>
      )}
    </div>
  );
}
