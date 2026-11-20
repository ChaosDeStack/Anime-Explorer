import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { useAuth } from '../context/AuthContext'

// A fake navigate function so we can check where the user is sent
const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderNavbar() {
  render(<MemoryRouter><Navbar /></MemoryRouter>)
}

test('shows Login and Register when logged out', () => {
  useAuth.mockReturnValue({ user: null, logout: vi.fn() })
  renderNavbar()

  expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
})

test('shows Watchlist and Logout when logged in', () => {
  useAuth.mockReturnValue({ user: { email: 'a@b.com' }, logout: vi.fn() })
  renderNavbar()

  expect(screen.getByRole('link', { name: 'Watchlist' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument()
  expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
})

test('logout calls logout and goes to the login page', async () => {
  const logout = vi.fn().mockResolvedValue()
  useAuth.mockReturnValue({ user: { email: 'a@b.com' }, logout })
  renderNavbar()

  await userEvent.click(screen.getByRole('button', { name: 'Logout' }))

  expect(logout).toHaveBeenCalled()
  expect(mockNavigate).toHaveBeenCalledWith('/login', expect.anything())
})