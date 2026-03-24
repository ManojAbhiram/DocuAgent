import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import ContractAnalyzer from './pages/ContractAnalyzer';
import InvoiceAuditor from './pages/InvoiceAuditor';
import FinancialAnalyzer from './pages/FinancialAnalyzer';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-900 transition-colors duration-200">
              <Sidebar toggleTheme={toggleTheme} theme={theme} />
              <main className="flex-1 overflow-y-auto w-full p-4 lg:p-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/contracts" element={<ContractAnalyzer />} />
                  <Route path="/invoices" element={<InvoiceAuditor />} />
                  <Route path="/financial" element={<FinancialAnalyzer />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
