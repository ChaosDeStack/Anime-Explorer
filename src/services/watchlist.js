import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

// Data is stored at: users/{userId}/watchlist/{animeId}
// Using the anime id as the document id means the same anime can't be saved twice.

// CREATE: save an anime to the user's watchlist
export function addToWatchlist(uid, anime) {
  return setDoc(doc(db, 'users', uid, 'watchlist', String(anime.mal_id)), {
    mal_id: anime.mal_id,
    title: anime.title,
    image: anime.images.jpg.image_url,
    score: anime.score ?? null,
    episodes: anime.episodes ?? null,
    status: 'Plan to watch', // starting status
    addedAt: Date.now(),
  })
}

// UPDATE: change the status (Plan to watch / Watching / Completed)
export function updateStatus(uid, animeId, status) {
  return updateDoc(doc(db, 'users', uid, 'watchlist', String(animeId)), { status })
}

// DELETE: remove an anime from the watchlist
export function removeFromWatchlist(uid, animeId) {
  return deleteDoc(doc(db, 'users', uid, 'watchlist', String(animeId)))
}

// READ: listen to the watchlist. The callback runs now and again
// whenever the data changes. It returns a function that stops listening.
export function listenToWatchlist(uid, callback) {
  return onSnapshot(collection(db, 'users', uid, 'watchlist'), (snapshot) => {
    const items = snapshot.docs.map((d) => d.data())
    callback(items)
  })
}