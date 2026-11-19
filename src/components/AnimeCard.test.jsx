import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AnimeCard from './AnimeCard'

const anime = {
  mal_id: 20,
  title: 'Naruto',
  score: 8.0,
  episodes: 220,
  images: { jpg: { image_url: 'naruto.jpg' } },
}

// Link needs a Router, so we wrap the component in a MemoryRouter
test('shows the title and links to the details page', () => {
  render(<MemoryRouter><AnimeCard anime={anime} /></MemoryRouter>)

  expect(screen.getByText('Naruto')).toBeInTheDocument()
  expect(screen.getByRole('link')).toHaveAttribute('href', '/anime/20')
})

test('shows N/A and ? when score and episodes are missing', () => {
  const noData = { ...anime, score: null, episodes: null }
  render(<MemoryRouter><AnimeCard anime={noData} /></MemoryRouter>)

  expect(screen.getByText(/Score: N\/A/)).toBeInTheDocument()
  expect(screen.getByText(/Episodes: \?/)).toBeInTheDocument()
})