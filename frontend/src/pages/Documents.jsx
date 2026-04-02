import { useState, useEffect } from 'react';
import { UploadCloud, File, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Documents() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]); // This will now hold { name, size, status, id } objects
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
    // Set up a poll for processing status
    const interval = setInterval(fetchDocuments, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/documents/');
      // Map backend documents to the local UI format
      const formatted = res.data.map(doc => ({
        name: doc.filename,
        size: 0, // Backend might not store size, or we can add it
        status: doc.status.toLowerCase(), // 'uploaded', 'processing', 'completed', 'failed'
        id: doc.id
      }));
      setFiles(formatted);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleFiles = async (newFiles) => {
    const filesArray = Array.from(newFiles);
    
    for (const file of filesArray) {
      const formData = new FormData();
      formData.append('files', file);
      let docType = "General";
      if (file.name.toLowerCase().includes('contract')) docType = "Contract";
      if (file.name.toLowerCase().includes('invoice')) docType = "Invoice";
      
      // Temporary optimistic update
      setFiles(prev => [...prev, { name: file.name, size: file.size, status: 'uploading' }]);

      try {
        await axios.post(`/documents/upload?doc_type=${docType}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        fetchDocuments(); // Refresh list to get real IDs and status
      } catch (err) {
        console.error("Upload failed for", file.name, err);
        fetchDocuments();
      }
    }
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
                    {file.size > 0 && <p className="text-xs text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium">
                  {file.status === 'uploading' || file.status === 'uploaded' || file.status === 'processing' ? (
                    <div className="flex items-center text-primary-600 dark:text-primary-400">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {file.status === 'uploading' ? 'Uploading...' : 'Processing...'}
                    </div>
                  ) : file.status === 'completed' || file.status === 'success' ? (
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Completed
                    </div>
                  ) : file.status === 'failed' || file.status === 'error' ? (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Failed
                    </div>
                  ) : (
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      {file.status}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
