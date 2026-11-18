import { Link } from 'react-router-dom'

// Shows ONE anime. Clicking it opens the details page.
function AnimeCard({ anime }) {
  return (
    // Link changes the URL without reloading the page
    <Link to={`/anime/${anime.mal_id}`} className="block border rounded shadow overflow-hidden hover:shadow-lg">
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-3">
        <h2 className="font-bold">{anime.title}</h2>
        <p className="text-sm text-gray-600">
          Score: {anime.score ?? 'N/A'} | Episodes: {anime.episodes ?? '?'}
        </p>
      </div>
    </Link>
  )
}

export default AnimeCard