import {
  addToWatchlist,
  updateStatus,
  removeFromWatchlist,
  listenToWatchlist,
} from './watchlist'
import { doc, collection, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

// Fake Firebase so the tests never touch the real database
vi.mock('../firebase', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  doc: vi.fn((...args) => ({ path: args.slice(1).join('/') })),
  collection: vi.fn((...args) => ({ path: args.slice(1).join('/') })),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
}))

beforeEach(() => vi.clearAllMocks())

test('addToWatchlist saves the anime under the user', async () => {
  const anime = {
    mal_id: 20, title: 'Naruto', score: 8, episodes: 220,
    images: { jpg: { image_url: 'n.jpg' } },
  }
  await addToWatchlist('user1', anime)

  expect(doc).toHaveBeenCalledWith({}, 'users', 'user1', 'watchlist', '20')
  expect(setDoc).toHaveBeenCalledWith(
    { path: 'users/user1/watchlist/20' },
    expect.objectContaining({ mal_id: 20, title: 'Naruto', image: 'n.jpg', status: 'Plan to watch' })
  )
})

test('addToWatchlist saves null when score and episodes are missing', async () => {
  const anime = { mal_id: 1, title: 'X', images: { jpg: { image_url: 'x.jpg' } } }
  await addToWatchlist('user1', anime)

  expect(setDoc).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({ score: null, episodes: null })
  )
})

test('updateStatus changes the status', async () => {
  await updateStatus('user1', 20, 'Completed')

  expect(updateDoc).toHaveBeenCalledWith(
    { path: 'users/user1/watchlist/20' },
    { status: 'Completed' }
  )
})

test('removeFromWatchlist deletes the anime', async () => {
  await removeFromWatchlist('user1', 20)

  expect(deleteDoc).toHaveBeenCalledWith({ path: 'users/user1/watchlist/20' })
})

test('listenToWatchlist sends the saved anime to the callback', () => {
  const unsubscribe = vi.fn()
  onSnapshot.mockImplementation((ref, handler) => {
    handler({ docs: [{ data: () => ({ mal_id: 1, title: 'A' }) }] })
    return unsubscribe
  })
  const callback = vi.fn()

  const result = listenToWatchlist('user1', callback)

  expect(collection).toHaveBeenCalledWith({}, 'users', 'user1', 'watchlist')
  expect(callback).toHaveBeenCalledWith([{ mal_id: 1, title: 'A' }])
  expect(result).toBe(unsubscribe)
})