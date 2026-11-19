import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps a page: only logged-in users can see it
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  // Not logged in? Send them to the login page.
  // "replace" stops the back button from returning to the blocked page.
  if (!user) return <Navigate to="/login" replace />

  // Logged in: show the page
  return children
}

export default ProtectedRoute