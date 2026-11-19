import { searchAnime, getAnimeById } from './jikan'

// After each test, remove the fake fetch
afterEach(() => vi.unstubAllGlobals())

test('searchAnime returns the list of anime', async () => {
  // Replace the real fetch with a fake one that "succeeds"
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: [{ mal_id: 1, title: 'Naruto' }] }),
  }))

  const result = await searchAnime('naruto')

  expect(result).toEqual([{ mal_id: 1, title: 'Naruto' }])
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('q=naruto'))
})

test('searchAnime throws an error when the request fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

  await expect(searchAnime('naruto')).rejects.toThrow('Failed to fetch anime')
})

test('getAnimeById returns one anime', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: { mal_id: 20, title: 'Naruto' } }),
  }))

  const result = await getAnimeById(20)

  expect(result.title).toBe('Naruto')
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/anime/20'))
})

test('getAnimeById throws an error when the request fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))

  await expect(getAnimeById(20)).rejects.toThrow('Failed to fetch anime details')
})