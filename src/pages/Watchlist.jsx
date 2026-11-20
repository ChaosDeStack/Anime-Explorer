import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  listenToWatchlist,
  updateStatus,
  removeFromWatchlist,
} from '../services/watchlist'

const STATUSES = ['Plan to watch', 'Watching', 'Completed']

function Watchlist() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Start listening when the page opens, stop when it closes
  useEffect(() => {
    const unsubscribe = listenToWatchlist(user.uid, (list) => {
      setItems(list)
      setLoading(false)
    })
    return unsubscribe // cleanup
  }, [user.uid])

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-rose-600">My Watchlist</h1>

      {/* Empty state */}
      {items.length === 0 && (
        <p className="mt-6 text-slate-400">
          Nothing saved yet. Find an anime and click "Add to watchlist".
        </p>
      )}

      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.mal_id} className="flex items-center gap-4 border rounded p-3">
            <img src={item.image} alt={item.title} className="w-16 h-24 object-cover rounded" />

            <div className="flex-1">
              <Link to={`/anime/${item.mal_id}`} className="font-bold text-rose-600">
                {item.title}
              </Link>
              <p className="text-sm text-slate-600">
                Score: {item.score ?? 'N/A'} | Episodes: {item.episodes ?? '?'}
              </p>

              {/* Changing the select updates Firestore */}
              <label htmlFor={`status-${item.mal_id}`} className="sr-only">Status</label>
              <select
                id={`status-${item.mal_id}`}
                value={item.status}
                onChange={(e) => updateStatus(user.uid, item.mal_id, e.target.value)}
                className="border rounded px-2 py-1 mt-1 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => removeFromWatchlist(user.uid, item.mal_id)}
              className="text-red-400 text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Watchlist