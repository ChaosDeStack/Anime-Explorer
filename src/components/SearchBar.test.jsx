import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from './SearchBar'

test('calls onSearch with the trimmed text', async () => {
  const onSearch = vi.fn() // a fake function that records its calls
  render(<SearchBar onSearch={onSearch} />)

  await userEvent.type(screen.getByPlaceholderText('Search anime...'), '  naruto  ')
  await userEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(onSearch).toHaveBeenCalledWith('naruto')
})

test('does not search when the box is empty', async () => {
  const onSearch = vi.fn()
  render(<SearchBar onSearch={onSearch} />)

  await userEvent.click(screen.getByRole('button', { name: 'Search' }))

  expect(onSearch).not.toHaveBeenCalled()
})