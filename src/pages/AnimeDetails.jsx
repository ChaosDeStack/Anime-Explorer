import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAnimeById } from '../services/jikan'

function AnimeDetails() {
  // useParams reads the :id part of the URL (/anime/:id)
  const { id } = useParams()
  const navigate = useNavigate()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // useEffect runs code when the page opens (and when id changes)
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
  }, [id]) // dependency array: re-run only if id changes

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <button
        onClick={() => navigate('/')}
        className="text-indigo-600 hover:text-indigo-800"
      >
        ← Back to results
      </button                                                                          >
      <div className="flex flex-col md:flex-row gap-6 mt-4">
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="w-64 rounded shadow"
        />
        <div>
          <h1 className="text-2xl font-bold">{anime.title}</h1>
          <p className="text-gray-600 mt-1">
            Score: {anime.score ?? 'N/A'} | Episodes: {anime.episodes ?? '?'} | {anime.status}
          </p>
          {/* Genres is an array, so we map it into small labels */}
          <div className="flex flex-wrap gap-2 mt-3">
            {anime.genres.map((g) => (
              <span key={g.mal_id} className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-sm">
                {g.name}
              </span>
            ))}
          </div>
          <p className="mt-4">{anime.synopsis}</p>
        </div>
      </div>
    </div>
  )
}

export default AnimeDetails