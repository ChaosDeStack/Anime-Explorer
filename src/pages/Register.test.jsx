import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Register from './Register'
import { useAuth } from '../context/AuthContext'

const mockNavigate = vi.hoisted(() => vi.fn())

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => vi.clearAllMocks())

// Helper: fill in the form and click Register
async function fillAndSubmit({ email = 'a@b.com', password = '123456', confirm = '123456' } = {}) {
  render(<MemoryRouter><Register /></MemoryRouter>)
  await userEvent.type(screen.getByLabelText('Email'), email)
  await userEvent.type(screen.getByLabelText('Password'), password)
  await userEvent.type(screen.getByLabelText('Confirm password'), confirm)
  await userEvent.click(screen.getByRole('button', { name: 'Register' }))
}

test('shows an error when the password is too short', async () => {
  const register = vi.fn()
  useAuth.mockReturnValue({ register })
  await fillAndSubmit({ password: '123', confirm: '123' })

  expect(await screen.findByText('Password must be at least 6 characters.')).toBeInTheDocument()
  expect(register).not.toHaveBeenCalled()
})

test('shows an error when the passwords do not match', async () => {
  const register = vi.fn()
  useAuth.mockReturnValue({ register })
  await fillAndSubmit({ confirm: '654321' })

  expect(await screen.findByText('Passwords do not match.')).toBeInTheDocument()
  expect(register).not.toHaveBeenCalled()
})

test('registers and goes to the home page on success', async () => {
  const register = vi.fn().mockResolvedValue()
  useAuth.mockReturnValue({ register })
  await fillAndSubmit()

  expect(register).toHaveBeenCalledWith('a@b.com', '123456')
  expect(mockNavigate).toHaveBeenCalledWith('/')
})

test('shows a friendly message when the email is already used', async () => {
  const register = vi.fn().mockRejectedValue({ code: 'auth/email-already-in-use' })
  useAuth.mockReturnValue({ register })
  await fillAndSubmit()

  expect(await screen.findByText('That email is already registered.')).toBeInTheDocument()
})