// Shows ONE anime. It receives the anime object as a prop.
function AnimeCard({ anime }) {
  return (
    <div className="border rounded shadow overflow-hidden">
      <img
        src={anime.images.jpg.image_url}
        alt={anime.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-3">
        <h2 className="font-bold">{anime.title}</h2>
        {/* ?? shows the fallback when the value is null */}
        <p className="text-sm text-gray-600">
          Score: {anime.score ?? 'N/A'} | Episodes: {anime.episodes ?? '?'}
        </p>
      </div>
    </div>
  )
}

export default AnimeCard