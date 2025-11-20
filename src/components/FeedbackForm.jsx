import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function FeedbackForm() {
  const { code } = useParams()
  const [facility, setFacility] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [submitted, setSubmitted] = useState(null)

  useEffect(() => {
    const loadFacility = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
        const res = await fetch(`${baseUrl}/api/facilities/by-code/${code}`)
        if (!res.ok) throw new Error('Facility not found')
        const data = await res.json()
        setFacility(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    loadFacility()
  }, [code])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      // Try to get geo
      let user_lat = null, user_lng = null
      try {
        const pos = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) return resolve(null)
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
        })
        if (pos && pos.coords) {
          user_lat = pos.coords.latitude
          user_lng = pos.coords.longitude
        }
      } catch {}

      const res = await fetch(`${baseUrl}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facility_code: code, rating: Number(rating), comment, photo_url: photoUrl || null, user_lat, user_lng }),
      })
      if (!res.ok) throw new Error('Failed to submit feedback')
      const data = await res.json()
      setSubmitted(data)
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white bg-slate-900">Loading...</div>
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="bg-slate-800 text-white p-6 rounded-xl shadow-xl max-w-md w-full text-center">
        <h2 className="text-xl font-semibold mb-2">Invalid QR or Facility</h2>
        <p className="text-slate-300 mb-4">{error}</p>
        <Link to="/" className="inline-block px-4 py-2 bg-blue-600 rounded-lg">Go Home</Link>
      </div>
    </div>
  )

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-emerald-700 mb-2">Thank you!</h2>
        <p className="text-gray-700 mb-4">Your feedback has been recorded. Our cleaning team will be notified immediately.</p>
        <Link to="/" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg">Close</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-blue-950 text-white p-6">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <p className="text-blue-300/80 text-sm">Facility</p>
          <h1 className="text-3xl font-bold">{facility?.name || 'Public Facility'}</h1>
          <p className="text-slate-300">{facility?.address}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-blue-400/20 rounded-2xl p-6 space-y-5">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Rate Cleanliness</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setRating(n)} className={`h-10 w-10 rounded-full border ${rating>=n? 'bg-yellow-400 text-black border-yellow-300':'border-slate-600'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Comments (optional)</label>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the issue" />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-2">Photo URL (optional)</label>
            <input value={photoUrl} onChange={e=>setPhotoUrl(e.target.value)} className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://image.host/your-photo.jpg" />
            <p className="text-xs text-slate-400 mt-1">For demo, paste a link to an image. App uploads can be added later.</p>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors">Submit Feedback</button>
          <p className="text-xs text-slate-400 text-center">QR Code: {code}</p>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-blue-300 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}
