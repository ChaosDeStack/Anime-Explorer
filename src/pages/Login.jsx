import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Email and password login
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      setSubmitting(true)
      await login(email, password)
      navigate('/')
    } catch (err) {
      // Firebase v9+ uses one code for wrong email OR wrong password
      if (err.code === 'auth/invalid-credential') {
        setError('Wrong email or password.')
      } else {
        setError('Could not log in. Try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Google login (opens a popup)
  async function handleGoogle() {
    setError('')
    try {
      await loginWithGoogle()
      navigate('/')
    } catch (err) {
      // If the user just closes the popup, we don't show an error
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Try again.')
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 p-4">
      <h1 className="text-2xl font-bold text-center text-indigo-600">Log in</h1>
      {location.state?.message && (
  <p className="text-green-600 mt-4 text-center">{location.state.message}</p>
)}

      {error && <p role="alert" className="text-red-600 mt-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2" />

        <button disabled={submitting}
          className="bg-indigo-600 text-white py-2 rounded disabled:opacity-50">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      {/* type="button" so it doesn't submit the form above */}
      <button type="button" onClick={handleGoogle}
        className="w-full border py-2 rounded mt-3 hover:bg-gray-100">
        Continue with Google
      </button>

      <p className="text-center mt-4">
        No account? <Link to="/register" className="text-indigo-600">Register</Link>
      </p>
    </div>
  )
}

export default Login