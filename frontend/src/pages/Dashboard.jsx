import { ShieldCheck, Activity, Users, FileLock } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Documents Processed', value: '1,492', icon: FileLock, color: 'text-primary-500' },
    { label: 'PII Elements Masked', value: '45,801', icon: ShieldCheck, color: 'text-blue-500' },
    { label: 'Active Users', value: '12', icon: Users, color: 'text-indigo-500' },
    { label: 'System Uptime (SLA)', value: '99.98%', icon: Activity, color: 'text-green-500' }
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Secure Platform Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Enterprise metrics and LLM guardrail performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
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
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Recent Audit Logs</h2>
        <div className="overflow-x-auto">
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
              {/* Dummy data representing actual audit logs */}
              {['DOCUMENT_UPLOAD', 'LLM_CALL', 'DOCUMENT_PROCESSED'].map((action, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-dark-700 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4">2026-03-23 10:45:0{i}</td>
                  <td className="px-6 py-4 font-medium text-primary-600 dark:text-primary-400">{action}</td>
                  <td className="px-6 py-4">Admin</td>
                  <td className="px-6 py-4 truncate max-w-xs">{action === 'LLM_CALL' ? 'Masked 5 PII elements before sending' : 'Success'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
