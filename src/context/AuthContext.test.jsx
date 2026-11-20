import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

// Fake Firebase Auth
vi.mock('../firebase', () => ({
  auth: { name: 'fake-auth' },
  googleProvider: { name: 'fake-google' },
}))
vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

// A tiny component that uses the context so we can test it
function Demo() {
  const { user, register, login, loginWithGoogle, logout } = useAuth()
  return (
    <div>
      <p>{user ? `Hello ${user.email}` : 'No user'}</p>
      <button onClick={() => register('a@b.com', '123456')}>register</button>
      <button onClick={() => login('a@b.com', '123456')}>login</button>
      <button onClick={loginWithGoogle}>google</button>
      <button onClick={logout}>logout</button>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  // By default Firebase says "nobody is logged in"
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback(null)
    return vi.fn()
  })
})

test('shows no user when nobody is logged in', async () => {
  render(<AuthProvider><Demo /></AuthProvider>)

  expect(await screen.findByText('No user')).toBeInTheDocument()
})

test('shows the user when Firebase says someone is logged in', async () => {
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback({ email: 'me@x.com' })
    return vi.fn()
  })
  render(<AuthProvider><Demo /></AuthProvider>)

  expect(await screen.findByText('Hello me@x.com')).toBeInTheDocument()
})

test('register, login, Google login and logout call Firebase', async () => {
  render(<AuthProvider><Demo /></AuthProvider>)
  await screen.findByText('No user')

  await userEvent.click(screen.getByRole('button', { name: 'register' }))
  expect(createUserWithEmailAndPassword).toHaveBeenCalledWith({ name: 'fake-auth' }, 'a@b.com', '123456')

  await userEvent.click(screen.getByRole('button', { name: 'login' }))
  expect(signInWithEmailAndPassword).toHaveBeenCalledWith({ name: 'fake-auth' }, 'a@b.com', '123456')

  await userEvent.click(screen.getByRole('button', { name: 'google' }))
  expect(signInWithPopup).toHaveBeenCalledWith({ name: 'fake-auth' }, { name: 'fake-google' })

  await userEvent.click(screen.getByRole('button', { name: 'logout' }))
  expect(signOut).toHaveBeenCalledWith({ name: 'fake-auth' })
})

test('stops listening to Firebase when removed from the page', async () => {
  const unsubscribe = vi.fn()
  onAuthStateChanged.mockImplementation((auth, callback) => {
    callback(null)
    return unsubscribe
  })
  const { unmount } = render(<AuthProvider><Demo /></AuthProvider>)
  await screen.findByText('No user')

  unmount()

  expect(unsubscribe).toHaveBeenCalled()
})