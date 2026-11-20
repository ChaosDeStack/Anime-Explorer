import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Login from './Login'
import { useAuth } from '../context/AuthContext'

const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => vi.clearAllMocks())

function renderLogin(auth) {
  useAuth.mockReturnValue(auth)
  render(<MemoryRouter><Login /></MemoryRouter>)
}

async function submitForm() {
  await userEvent.type(screen.getByLabelText('Email'), 'a@b.com')
  await userEvent.type(screen.getByLabelText('Password'), '123456')
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
}

test('logs in and goes to the home page', async () => {
  const login = vi.fn().mockResolvedValue()
  renderLogin({ login, loginWithGoogle: vi.fn() })
  await submitForm()

  expect(login).toHaveBeenCalledWith('a@b.com', '123456')
  expect(mockNavigate).toHaveBeenCalledWith('/')
})

test('shows an error for a wrong email or password', async () => {
  const login = vi.fn().mockRejectedValue({ code: 'auth/invalid-credential' })
  renderLogin({ login, loginWithGoogle: vi.fn() })
  await submitForm()

  expect(await screen.findByText('Wrong email or password.')).toBeInTheDocument()
})

test('Google login goes to the home page', async () => {
  const loginWithGoogle = vi.fn().mockResolvedValue()
  renderLogin({ login: vi.fn(), loginWithGoogle })
  await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))

  expect(loginWithGoogle).toHaveBeenCalled()
  expect(mockNavigate).toHaveBeenCalledWith('/')
})

test('shows an error when Google sign-in fails', async () => {
  const loginWithGoogle = vi.fn().mockRejectedValue({ code: 'auth/network-request-failed' })
  renderLogin({ login: vi.fn(), loginWithGoogle })
  await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))

  expect(await screen.findByText('Google sign-in failed. Try again.')).toBeInTheDocument()
})

test('shows no error when the user closes the Google popup', async () => {
  const loginWithGoogle = vi.fn().mockRejectedValue({ code: 'auth/popup-closed-by-user' })
  renderLogin({ login: vi.fn(), loginWithGoogle })
  await userEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))

  await waitFor(() => expect(loginWithGoogle).toHaveBeenCalled())
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})