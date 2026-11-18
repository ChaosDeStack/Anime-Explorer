import { useState } from 'react'
import SearchBar from './components/SearchBar'
import AnimeList from './components/AnimeList'
import { searchAnime } from './services/jikan'

function App() {
  const [animeList, setAnimeList] = useState([]) // search results
  const [loading, setLoading] = useState(false)  // true while fetching
  const [error, setError] = useState('')         // error message, if any

  async function handleSearch(query) {
    setLoading(true)
    setError('')
    try {
      // Try to get the anime from the API
      const results = await searchAnime(query)
      setAnimeList(results)
    } catch (err) {
      // If anything fails, show the error message
      setError(err.message)
    } finally {
      // Runs always: stop the loading message
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-indigo-600 mt-8">
        Anime Explorer
      </h1>
      <SearchBar onSearch={handleSearch} />

      {/* Conditional rendering: each message shows only when needed */}
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && animeList.length === 0 && (
        <p className="text-center text-gray-500">Search for an anime to begin.</p>
      )}

      <AnimeList animeList={animeList} />
    </div>
  )
}

export default App