import { useState } from 'react';
import { UploadCloud, File, CheckCircle } from 'lucide-react';

export default function Documents() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    setFiles([...files, ...Array.from(newFiles)]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Multi-Document Ingestion</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Securely upload and queue documents for async processing.</p>
      </header>

      <div 
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl transition-all duration-200 ${dragActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-800 hover:bg-slate-50 dark:hover:bg-dark-700'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <UploadCloud className={`w-16 h-16 mb-4 ${dragActive ? 'text-primary-500' : 'text-slate-400 dark:text-slate-500'}`} />
        <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-primary-600 dark:text-primary-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">PDF, PNG, JPG (MAX. 10MB)</p>
        <input 
          type="file" 
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={handleChange}
        />
      </div>

      {files.length > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-700">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Processing Queue</h3>
          <ul className="space-y-3">
            {files.map((file, idx) => (
              <li key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-900 rounded-xl">
                <div className="flex items-center">
                  <File className="w-6 h-6 text-primary-500 mr-4" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Queued
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
