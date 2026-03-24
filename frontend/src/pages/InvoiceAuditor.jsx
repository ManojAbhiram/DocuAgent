import { useState } from 'react';
import { ShieldAlert, Receipt, CheckCircle } from 'lucide-react';

export default function InvoiceAuditor() {
  const [result, setResult] = useState(null);

  const mockAudit = () => {
    setResult({
      validGST: true,
      gstNumber: '29ABCDE1234F1Z5',
      duplicateFound: false,
      amount: '$14,500.00'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Invoice Auditor</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Duplicate detection, GST validation, and secure financial analysis.</p>
      </header>

      <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Select an invoice from the processing queue to run the audit against our backend database and AI checks.
            </p>
            <button 
              onClick={mockAudit}
              className="py-2 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium rounded-lg shadow whitespace-nowrap hover:opacity-90 transition-opacity"
            >
              Run Rapid Audit
            </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-4">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">GST Validation</h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{result.validGST ? 'Valid Format' : 'Invalid'}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-dark-700 pt-4">
              Extracted GST: <span className="font-mono bg-slate-100 dark:bg-dark-900 px-2 py-1 rounded text-primary-600 dark:text-primary-400">{result.gstNumber}</span>
            </p>
          </div>

          <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Amount</h3>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{result.amount}</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-dark-700 pt-4 flex items-center">
               <ShieldAlert className="w-4 h-4 text-emerald-500 mr-2" />
               {result.duplicateFound ? 'Duplicate found in history!' : 'No duplicates detected in historical DB.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
