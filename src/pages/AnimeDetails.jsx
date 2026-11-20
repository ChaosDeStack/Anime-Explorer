import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getAnimeById } from '../services/jikan'
import { useAuth } from '../context/AuthContext'
import {
  addToWatchlist,
  removeFromWatchlist,
  listenToWatchlist,
} from '../services/watchlist'

function AnimeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth() // null if logged out

  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false) // is it in the watchlist?

  // Fetch the anime when the page opens (and when id changes)
  useEffect(() => {
    async function loadAnime() {
      try {
        const data = await getAnimeById(id)
        setAnime(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAnime()
  }, [id])

  // If logged in, check whether this anime is already in the watchlist
  useEffect(() => {
    if (!user) return
    const unsubscribe = listenToWatchlist(user.uid, (list) => {
      setSaved(list.some((item) => String(item.mal_id) === String(id)))
    })
    return unsubscribe
  }, [user, id])

  // Add or remove depending on the current state
  async function handleWatchlist() {
    try {
      if (saved) {
        await removeFromWatchlist(user.uid, id)
      } else {
        await addToWatchlist(user.uid, anime)
      }
    } catch {
      setError('Could not update your watchlist. Try again.')
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-400">{error}</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-rose-400 hover:text-rose-300"
      >
        ← Back to results
      </button>

      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="w-64 rounded shadow"
        />
        <div>
          <h1 className="text-2xl font-bold">{anime.title}</h1>
          <p className="text-slate-600 mt-1">
            Score: {anime.score ?? 'N/A'} | Episodes: {anime.episodes ?? '?'} | {anime.status}
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            {anime.genres.map((g) => (
              <span
                key={g.mal_id}
                className="bg-cyan-900 text-cyan-200 px-2 py-1 rounded text-sm"
              >
                {g.name}
              </span>
            ))}
          </div>

          {/* Logged in: add/remove button. Logged out: link to login. */}
          {user ? (
            <button
              onClick={handleWatchlist}
              className="mt-4 bg-rose-600 text-white px-4 py-2 rounded"
            >
              {saved ? 'Remove from watchlist' : 'Add to watchlist'}
            </button>
          ) : (
            <Link to="/login" className="inline-block mt-4 text-rose-400 underline">
              Log in to save this anime
            </Link>
          )}

          <p className="mt-4">{anime.synopsis}</p>
        </div>
      </div>
    </div>
  )
}

export default AnimeDetails