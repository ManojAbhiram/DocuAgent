import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (!email || !password) throw new Error("Please fill in all fields");
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-900 px-4 transition-colors duration-200">
      <div className="max-w-md w-full bg-white dark:bg-dark-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-dark-700">
        <div className="p-8">
          <div className="text-center mb-8">
            <ShieldCheck className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Sign in to securely access DocuAgent.</p>
          </div>

          {error && <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-center border border-red-100 dark:border-red-900">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-slate-100 transition-all"
                  placeholder="admin@docuagent.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-dark-900 border border-slate-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-slate-100 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-lg shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="px-8 py-4 bg-slate-50 dark:bg-dark-900/50 border-t border-slate-100 dark:border-dark-700 text-center text-sm">
          <span className="text-slate-600 dark:text-slate-400">Don't have an account? </span>
          <Link to="/signup" className="font-semibold text-primary-600 dark:text-primary-400 hover:underline">
            Request Access
          </Link>
        </div>
      </div>
    </div>
  );
}
