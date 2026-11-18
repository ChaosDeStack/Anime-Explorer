import { useState } from 'react'
import SearchBar from './components/SearchBar'
import AnimeList from './components/AnimeList'
import { searchAnime } from './services/jikan'

function App() {
  // State: the search results
  const [animeList, setAnimeList] = useState([])

  // Called by SearchBar when the user searches
  async function handleSearch(query) {
    const results = await searchAnime(query)
    setAnimeList(results)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-indigo-600 mt-8">
        Anime Explorer
      </h1>
      <SearchBar onSearch={handleSearch} />
      <AnimeList animeList={animeList} />
    </div>
  )
}

export default App