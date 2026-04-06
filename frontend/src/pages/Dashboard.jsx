import { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Users, FileLock, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    docs_processed: '0',
    pii_masked: '0',
    active_users: '0',
    uptime: '100%'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/audit-logs/');
      setLogs(res.data.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch logs", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/audit-logs/stats');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setIsLoading(false);
    }
  };

  const statConfig = [
    { label: 'Documents Processed', value: stats.docs_processed.toLocaleString(), icon: FileLock, color: 'text-primary-500' },
    { label: 'PII Elements Masked', value: stats.pii_masked.toLocaleString(), icon: ShieldCheck, color: 'text-blue-500' },
    { label: 'Active Users', value: stats.active_users, icon: Users, color: 'text-indigo-500' },
    { label: 'System Uptime (SLA)', value: stats.uptime, icon: Activity, color: 'text-green-500' }
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Secure Platform Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Enterprise metrics and LLM guardrail performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statConfig.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-dark-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-xl bg-slate-50 dark:bg-dark-700 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white dark:bg-dark-800 rounded-2xl shadow-sm border border-slate-100 dark:border-dark-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Audit Logs</h2>
          <button onClick={fetchLogs} className="text-xs text-primary-500 hover:underline">Refresh</button>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-dark-700 text-slate-500 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-3 font-medium rounded-tl-lg">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">User ID</th>
                  <th className="px-6 py-3 font-medium rounded-tr-lg">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">No recent logs found.</td>
                  </tr>
                ) : (
                  logs.map((log, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors">
                      <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-400">{log.action}</td>
                      <td className="px-6 py-4">{log.user_id}</td>
                      <td className="px-6 py-4 truncate max-w-xs">{log.details}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
