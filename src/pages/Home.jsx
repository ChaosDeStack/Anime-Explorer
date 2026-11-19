import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import AnimeList from '../components/AnimeList'
import { searchAnime } from '../services/jikan'

function Home() {
  // searchParams reads and writes the ?q=... part of the URL
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || '' // '' if there is no search yet

  const [animeList, setAnimeList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Runs whenever the search word in the URL changes
  // (including when you come back from a details page)
  useEffect(() => {
    // No search word: clear the results and stop
    if (!query) {
      setAnimeList([])
      return
    }

    async function loadResults() {
      setLoading(true)
      setError('')
      try {
        const results = await searchAnime(query)
        setAnimeList(results)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [query]) // re-run only when the search word changes

  // Searching just updates the URL. The useEffect above does the fetching.
  function handleSearch(text) {
    setSearchParams({ q: text })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-indigo-600 mt-8">
        Anime Explorer
      </h1>
      {/* initialValue keeps the search word inside the input box */}
      <SearchBar onSearch={handleSearch} initialValue={query} />
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && animeList.length === 0 && (
        <p className="text-center text-gray-500">
          {query ? 'No anime found.' : 'Search for an anime to begin.'}
        </p>
      )}
      <AnimeList animeList={animeList} />
    </div>
  )
}

export default Home