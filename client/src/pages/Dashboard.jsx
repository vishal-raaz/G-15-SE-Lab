import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStatsAPI, getPapersAPI } from '../services/api';

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="glass-card p-6 flex items-center gap-5 hover:border-surface-600/60 transition-all duration-200 animate-slide-up">
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center text-2xl shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-surface-400 text-sm mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalQuestions: 0, totalPapers: 0, aiQuestions: 0 });
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, papersRes] = await Promise.all([getStatsAPI(), getPapersAPI()]);
        setStats(statsRes.data);
        setPapers(papersRes.data.slice(0, 5)); // show 5 most recent
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-surface-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-surface-50">Overview</h2>
        <p className="text-surface-400 text-sm mt-1">Welcome to your AI Question Paper Generator dashboard</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          icon="📚"
          label="Total Questions Saved"
          value={stats.totalQuestions}
          color="text-primary-400"
          bg="bg-primary-500/10 border border-primary-500/20"
        />
        <StatCard
          icon="📄"
          label="Papers Generated"
          value={stats.totalPapers}
          color="text-emerald-400"
          bg="bg-emerald-500/10 border border-emerald-500/20"
        />
        <StatCard
          icon="🤖"
          label="AI Generated Questions"
          value={stats.aiQuestions}
          color="text-purple-400"
          bg="bg-purple-500/10 border border-purple-500/20"
        />
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-surface-200 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            id="btn-quick-generate"
            onClick={() => navigate('/generator')}
            className="btn-primary flex items-center gap-2"
          >
            <span>🤖</span> Generate Questions
          </button>
          <button
            id="btn-quick-builder"
            onClick={() => navigate('/builder')}
            className="btn-secondary flex items-center gap-2"
          >
            <span>📄</span> Build Paper
          </button>
          <button
            id="btn-quick-preview"
            onClick={() => navigate('/preview')}
            className="btn-secondary flex items-center gap-2"
          >
            <span>👁️</span> Preview Paper
          </button>
        </div>
      </div>

      {/* Recent Papers */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-surface-200">Recent Papers</h3>
          <button onClick={() => navigate('/builder')} className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
            Create New →
          </button>
        </div>

        {papers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-surface-400 text-sm">No papers created yet.</p>
            <button
              onClick={() => navigate('/generator')}
              className="btn-primary mt-4 text-sm px-4 py-2"
            >
              Generate Your First Paper
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700">
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider pb-3">Title</th>
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider pb-3">Subject</th>
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider pb-3">Marks</th>
                  <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800">
                {papers.map(paper => (
                  <tr key={paper._id} className="group hover:bg-surface-800/30 transition-colors">
                    <td className="py-3.5 text-sm font-medium text-surface-200 pr-4">{paper.title}</td>
                    <td className="py-3.5 text-sm text-surface-400 pr-4">{paper.subject}</td>
                    <td className="py-3.5">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                        {paper.totalMarks} marks
                      </span>
                    </td>
                    <td className="py-3.5 text-sm text-surface-500">
                      {new Date(paper.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
