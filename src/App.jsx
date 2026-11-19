import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import AnimeDetails from './pages/AnimeDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Watchlist from './pages/Watchlist'

function App() {
  return (
    <>
      {/* Navbar sits outside Routes, so it shows on every page */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anime/:id" element={<AnimeDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected: ProtectedRoute decides if the page can be shown */}
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App