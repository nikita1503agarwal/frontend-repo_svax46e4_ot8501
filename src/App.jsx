import { Link, Routes, Route } from 'react-router-dom'
import FeedbackForm from './components/FeedbackForm'
import Dashboard from './components/Dashboard'

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="relative min-h-screen flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">Swachh Scan</h1>
          <p className="text-lg text-blue-200 mb-8">QR-based cleanliness feedback with real-time alerts and performance tracking</p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            <a href="#" className="block bg-blue-600 hover:bg-blue-500 rounded-2xl p-5">
              <div className="text-left">
                <div className="text-sm opacity-90">Public Users</div>
                <div className="text-2xl font-semibold">Scan QR → Give Feedback</div>
                <div className="text-blue-100 text-sm mt-1">Opens simple web form, no app needed</div>
              </div>
            </a>
            <Link to="/dashboard" className="block bg-emerald-600 hover:bg-emerald-500 rounded-2xl p-5">
              <div className="text-left">
                <div className="text-sm opacity-90">Authorities</div>
                <div className="text-2xl font-semibold">View Dashboard</div>
                <div className="text-emerald-100 text-sm mt-1">Track status and staff performance</div>
              </div>
            </Link>
          </div>

          <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 text-left">
            <h3 className="font-semibold mb-2">How it works</h3>
            <ul className="list-disc list-inside text-blue-200/90 space-y-1 text-sm">
              <li>Each facility gets a unique QR code</li>
              <li>Citizens scan to open a feedback form in the browser</li>
              <li>Cleaning staff receive tasks, add before/after photos</li>
              <li>Dashboard shows live stats and top performers</li>
            </ul>
          </div>

          <div className="mt-8 text-blue-300/70 text-sm">
            Demo routes: Try /f/{'{code}'} for a feedback form or open the Dashboard
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/f/:code" element={<FeedbackForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}

export default App
