import AnimeCard from './AnimeCard'

// Shows many anime in a grid by looping through the array
function AnimeList({ animeList }) {
  return (
    // 2 columns on phones, 3 on tablets, 4 on desktops (responsive)
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {/* map() creates one AnimeCard for each anime. key must be unique. */}
      {animeList.map((anime) => (
        <AnimeCard key={anime.mal_id} anime={anime} />
      ))}
    </div>
  )
}

export default AnimeList