import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/stats`)
      if (!res.ok) throw new Error('Failed to load stats')
      const data = await res.json()
      setStats(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return <div className="text-white p-6">Loading...</div>
  if (error) return <div className="text-red-300 p-6">{error}</div>

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Swachh Scan Dashboard</h1>
          <p className="text-slate-300">Real-time status and performance insights</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat title="Total" value={stats.counts.total} color="bg-blue-600" />
          <Stat title="Open" value={stats.counts.open} color="bg-amber-500" />
          <Stat title="In Progress" value={stats.counts.in_progress} color="bg-purple-600" />
          <Stat title="Resolved" value={stats.counts.resolved} color="bg-emerald-600" />
        </div>

        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
          <div className="space-y-3">
            {stats.leaderboard && stats.leaderboard.length ? stats.leaderboard.map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">{i+1}</div>
                  <div>
                    <div className="font-medium">{s.staff_name || s.staff_id}</div>
                    <div className="text-xs text-slate-400">Resolved Tasks</div>
                  </div>
                </div>
                <div className="text-lg font-bold">{s.resolved_count}</div>
              </div>
            )) : <p className="text-slate-400">No resolved tasks yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ title, value, color }) {
  return (
    <div className={`rounded-2xl p-5 text-white ${color}`}>
      <div className="text-sm opacity-90">{title}</div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  )
}
