import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  // user is null when logged out, so we can show different links
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    // Send the user to login, with a message to show there
    navigate('/login', { state: { message: 'You have been logged out.' } })
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-2 bg-rose-600 text-white px-4 py-3">
      <Link to="/" className="font-bold text-lg">Anime Explorer</Link>

      <div className="flex items-center gap-4">
        <Link to="/">Home</Link>

        {/* Conditional rendering: different links for each state */}
        {user ? (
          <>
            <Link to="/watchlist">Watchlist</Link>
            <button onClick={handleLogout} className="bg-slate-950 text-cyan-300 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar