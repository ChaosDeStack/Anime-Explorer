import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'
import { searchAnime } from '../services/jikan'

// Fake API so no real internet request is made
vi.mock('../services/jikan', () => ({ searchAnime: vi.fn() }))

beforeEach(() => vi.clearAllMocks())

const naruto = {
  mal_id: 20, title: 'Naruto', score: 8, episodes: 220,
  images: { jpg: { image_url: 'n.jpg' } },
}

function renderHome(path = '/') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Home />
    </MemoryRouter>
  )
}

test('shows the start message when there is no search', () => {
  renderHome()

  expect(screen.getByText('Search for an anime to begin.')).toBeInTheDocument()
  expect(searchAnime).not.toHaveBeenCalled()
})

test('searches using the word in the URL', async () => {
  searchAnime.mockResolvedValue([naruto])
  renderHome('/?q=naruto')

  expect(await screen.findByText('Naruto')).toBeInTheDocument()
  expect(searchAnime).toHaveBeenCalledWith('naruto')
})

test('searches when the user types a word and submits', async () => {
  searchAnime.mockResolvedValue([naruto])
  renderHome()

  await userEvent.type(screen.getByPlaceholderText('Search anime...'), 'naruto')
  await userEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(await screen.findByText('Naruto')).toBeInTheDocument()
  expect(searchAnime).toHaveBeenCalledWith('naruto')
})

test('shows an error message when the search fails', async () => {
  searchAnime.mockRejectedValue(new Error('Failed to fetch anime'))
  renderHome('/?q=naruto')

  expect(await screen.findByText('Failed to fetch anime')).toBeInTheDocument()
})

test('shows a message when nothing is found', async () => {
  searchAnime.mockResolvedValue([])
  renderHome('/?q=zzzz')

  expect(await screen.findByText('No anime found.')).toBeInTheDocument()
})