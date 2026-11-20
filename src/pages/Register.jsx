import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  // Get the register function from our AuthContext
  const { register } = useAuth()
  // useNavigate lets us change page from code
  const navigate = useNavigate()

  // One state for each input, plus error and loading
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    // Validate the input before calling Firebase
    if (password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }
    if (password !== confirm) {
      return setError('Passwords do not match.')
    }

    try {
      setSubmitting(true)
      await register(email, password)
      navigate('/') // success: go to the home page
    } catch (err) {
      // Firebase gives error codes; we turn them into friendly messages
      if (err.code === 'auth/email-already-in-use') {
        setError('That email is already registered.')
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email.')
      } else {
        setError('Could not create account. Try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12 p-4">
      <h1 className="text-2xl font-bold text-center text-rose-600">Create account</h1>

      {/* role="alert" makes screen readers announce the error */}
      {error && <p role="alert" className="text-red-400 mt-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-6">
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2" />

        <label htmlFor="confirm">Confirm password</label>
        <input id="confirm" type="password" required value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="border rounded px-3 py-2" />

        <button disabled={submitting}
          className="bg-rose-600 text-white py-2 rounded disabled:opacity-50">
          {submitting ? 'Creating...' : 'Register'}
        </button>
      </form>

      <p className="text-center mt-4">
        Already have an account? <Link to="/login" className="text-rose-600">Log in</Link>
      </p>
    </div>
  )
}

export default Register