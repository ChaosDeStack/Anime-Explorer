import { useAuth } from '../context/AuthContext'

function Watchlist() {
  const { user } = useAuth()

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-indigo-600">My Watchlist</h1>
      <p className="mt-2 text-gray-600">Logged in as {user.email}</p>
      <p className="mt-6 text-gray-500">Your saved anime will appear here soon.</p>
    </div>
  )
}

export default Watchlist