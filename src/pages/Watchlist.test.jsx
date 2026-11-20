import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Watchlist from './Watchlist'
import { useAuth } from '../context/AuthContext'
import { listenToWatchlist, updateStatus, removeFromWatchlist } from '../services/watchlist'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../services/watchlist', () => ({
  listenToWatchlist: vi.fn(),
  updateStatus: vi.fn(),
  removeFromWatchlist: vi.fn(),
}))

const item = {
  mal_id: 20, title: 'Naruto', image: 'n.jpg',
  score: 8, episodes: 220, status: 'Plan to watch',
}

beforeEach(() => {
  vi.clearAllMocks()
  useAuth.mockReturnValue({ user: { uid: 'user1', email: 'a@b.com' } })
})

// Helper: pretend Firestore sends this list right away
function renderWatchlist(items) {
  listenToWatchlist.mockImplementation((uid, callback) => {
    callback(items)
    return vi.fn()
  })
  render(<MemoryRouter><Watchlist /></MemoryRouter>)
}

test('shows Loading while waiting for data', () => {
  listenToWatchlist.mockImplementation(() => vi.fn()) // never sends data
  render(<MemoryRouter><Watchlist /></MemoryRouter>)

  expect(screen.getByText('Loading...')).toBeInTheDocument()
})

test('shows the empty message when nothing is saved', () => {
  renderWatchlist([])

  expect(screen.getByText(/Nothing saved yet/)).toBeInTheDocument()
})

test('shows saved anime with a link to its details', () => {
  renderWatchlist([item])

  expect(screen.getByRole('link', { name: 'Naruto' })).toHaveAttribute('href', '/anime/20')
})

test('changing the status updates Firestore', async () => {
  renderWatchlist([item])

  await userEvent.selectOptions(screen.getByRole('combobox'), 'Completed')

  expect(updateStatus).toHaveBeenCalledWith('user1', 20, 'Completed')
})

test('Remove deletes the anime from the watchlist', async () => {
  renderWatchlist([item])

  await userEvent.click(screen.getByRole('button', { name: 'Remove' }))

  expect(removeFromWatchlist).toHaveBeenCalledWith('user1', 20)
})