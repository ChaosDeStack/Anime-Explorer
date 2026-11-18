import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AnimeDetails from './pages/AnimeDetails'

// App now only decides WHICH page to show for each URL
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* :id is a variable part of the URL */}
      <Route path="/anime/:id" element={<AnimeDetails />} />
    </Routes>
  )
}

export default App