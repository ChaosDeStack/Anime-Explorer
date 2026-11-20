import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AnimeDetails from './AnimeDetails'
import { getAnimeById } from '../services/jikan'
import { useAuth } from '../context/AuthContext'
import { addToWatchlist, removeFromWatchlist, listenToWatchlist } from '../services/watchlist'

const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('../services/jikan', () => ({ getAnimeById: vi.fn() }))
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('../services/watchlist', () => ({
  addToWatchlist: vi.fn(),
  removeFromWatchlist: vi.fn(),
  listenToWatchlist: vi.fn(),
}))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const anime = {
  mal_id: 20, title: 'Naruto', score: 8, episodes: 220,
  status: 'Finished Airing', synopsis: 'A ninja story.',
  images: { jpg: { large_image_url: 'n.jpg' } },
  genres: [{ mal_id: 1, name: 'Action' }],
}

beforeEach(() => {
  vi.clearAllMocks()
  getAnimeById.mockResolvedValue(anime)
  useAuth.mockReturnValue({ user: { uid: 'user1' } })
  // By default the watchlist is empty
  listenToWatchlist.mockImplementation((uid, callback) => {
    callback([])
    return vi.fn()
  })
})

// Opens the page at /anime/20, like a real click would
function renderDetails() {
  render(
    <MemoryRouter initialEntries={['/anime/20']}>
      <Routes>
        <Route path="/anime/:id" element={<AnimeDetails />} />
      </Routes>
    </MemoryRouter>
  )
}

test('shows Loading first, then the anime details', async () => {
  renderDetails()

  expect(screen.getByText('Loading...')).toBeInTheDocument()
  expect(await screen.findByText('Naruto')).toBeInTheDocument()
  expect(screen.getByText('Action')).toBeInTheDocument()
  expect(screen.getByText('A ninja story.')).toBeInTheDocument()
})

test('shows an error when the anime cannot be loaded', async () => {
  getAnimeById.mockRejectedValue(new Error('Failed to fetch anime details'))
  renderDetails()

  expect(await screen.findByText('Failed to fetch anime details')).toBeInTheDocument()
})

test('logged-out users see a login link instead of the button', async () => {
  useAuth.mockReturnValue({ user: null })
  renderDetails()

  expect(await screen.findByText('Log in to save this anime')).toBeInTheDocument()
  expect(listenToWatchlist).not.toHaveBeenCalled()
})

test('Add to watchlist saves the anime', async () => {
  renderDetails()

  await userEvent.click(await screen.findByRole('button', { name: 'Add to watchlist' }))

  expect(addToWatchlist).toHaveBeenCalledWith('user1', anime)
})

test('Remove from watchlist removes a saved anime', async () => {
  listenToWatchlist.mockImplementation((uid, callback) => {
    callback([{ mal_id: 20 }])
    return vi.fn()
  })
  renderDetails()

  await userEvent.click(await screen.findByRole('button', { name: 'Remove from watchlist' }))

  expect(removeFromWatchlist).toHaveBeenCalledWith('user1', '20')
})

test('shows an error when updating the watchlist fails', async () => {
  addToWatchlist.mockRejectedValue(new Error('fail'))
  renderDetails()

  await userEvent.click(await screen.findByRole('button', { name: 'Add to watchlist' }))

  expect(await screen.findByText('Could not update your watchlist. Try again.')).toBeInTheDocument()
})

test('the back button goes to the previous page', async () => {
  renderDetails()

  await userEvent.click(await screen.findByRole('button', { name: /Back to results/ }))

  expect(mockNavigate).toHaveBeenCalledWith(-1)
})