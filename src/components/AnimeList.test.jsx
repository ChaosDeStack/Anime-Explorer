import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AnimeList from './AnimeList'

const makeAnime = (id, title) => ({
  mal_id: id,
  title,
  score: 7,
  episodes: 12,
  images: { jpg: { image_url: `${title}.jpg` } },
})

test('renders one card for each anime', () => {
  const list = [makeAnime(1, 'Naruto'), makeAnime(2, 'Bleach')]
  render(<MemoryRouter><AnimeList animeList={list} /></MemoryRouter>)

  expect(screen.getByText('Naruto')).toBeInTheDocument()
  expect(screen.getByText('Bleach')).toBeInTheDocument()
})