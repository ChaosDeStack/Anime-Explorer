import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import { useAuth } from '../context/AuthContext'

// Replace the real useAuth with a fake so we can control the user
vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))

function renderAt(path) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route
          path="/watchlist"
          element={<ProtectedRoute><p>Secret page</p></ProtectedRoute>}
        />
      </Routes>
    </MemoryRouter>
  )
}

test('redirects to login when logged out', () => {
  useAuth.mockReturnValue({ user: null })
  renderAt('/watchlist')

  expect(screen.getByText('Login page')).toBeInTheDocument()
  expect(screen.queryByText('Secret page')).not.toBeInTheDocument()
})

test('shows the page when logged in', () => {
  useAuth.mockReturnValue({ user: { email: 'a@b.com' } })
  renderAt('/watchlist')

  expect(screen.getByText('Secret page')).toBeInTheDocument()
})