// Base address of the Jikan API (stored once so we don't repeat it)
const BASE_URL = 'https://api.jikan.moe/v4'

// Searches anime by name. "async" because it waits for the internet.
export async function searchAnime(query) {
  // encodeURIComponent makes the text safe for a URL (spaces become %20)
  const res = await fetch(
    `${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=12&sfw=true`
  )

  // If the server answers with an error, stop and report it
  if (!res.ok) throw new Error('Failed to fetch anime')

  // Convert the response to a JavaScript object
  const json = await res.json()

  // The list of anime is inside the "data" property
  return json.data
}