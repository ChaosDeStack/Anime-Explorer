import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

// 1. Create the context: a "shared box" any component can read from
const AuthContext = createContext()

// 2. The provider holds the data and wraps the whole app
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // the logged-in user, or null
  const [loading, setLoading] = useState(true) // true until Firebase checks

  // Firebase tells us whenever someone logs in or out.
  // It also remembers the user after a page refresh.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    // Cleanup: stop listening when the component is removed
    return unsubscribe
  }, [])

  // Functions the rest of the app can call
  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const logout = () => signOut(auth)

  // Everything inside "value" is available to any component below
  const value = { user, loading, register, login, loginWithGoogle, logout }

  // Don't show the app until we know if someone is logged in
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 3. A shortcut hook so components can write: const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}