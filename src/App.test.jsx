import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import { useAuth } from './context/AuthContext'

vi.mock('./context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('./services/watchlist', () => ({
  addToWatchlist: vi.fn(),
  updateStatus: vi.fn(),
  removeFromWatchlist: vi.fn(),
  listenToWatchlist: vi.fn(() => vi.fn()),
}))

function renderApp(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  )
}

test('shows the home page at /', () => {
  useAuth.mockReturnValue({ user: null })
  renderApp('/')

  expect(screen.getByText('Search for an anime to begin.')).toBeInTheDocument()
})

test('shows the register page at /register', () => {
  useAuth.mockReturnValue({ user: null })
  renderApp('/register')

  expect(screen.getByRole('heading', { name: 'Create account' })).toBeInTheDocument()
})

test('redirects a logged-out user from /watchlist to the login page', () => {
  useAuth.mockReturnValue({ user: null })
  renderApp('/watchlist')

  expect(screen.getByRole('heading', { name: 'Log in' })).toBeInTheDocument()
})

test('lets a logged-in user open /watchlist', () => {
  useAuth.mockReturnValue({ user: { uid: 'user1', email: 'a@b.com' }, logout: vi.fn() })
  renderApp('/watchlist')

  // The page opened (it shows Loading until Firestore answers)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})