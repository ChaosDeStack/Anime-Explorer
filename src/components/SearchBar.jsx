import { useState } from 'react'

// onSearch is a function passed down from App (a prop)
function SearchBar({ onSearch }) {
  // State: stores what the user is typing
  const [text, setText] = useState('')

  // Runs when the form is submitted
  function handleSubmit(e) {
    e.preventDefault() // stops the page from reloading
    // Only search if the text is not empty (trim removes extra spaces)
    if (text.trim()) onSearch(text.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center my-6">
      {/* sr-only hides the label visually but keeps it for screen readers */}
      <label htmlFor="search" className="sr-only">Search anime</label>
      {/* Controlled input: React state always matches what is typed */}
      <input
        id="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search anime..."
        className="border rounded px-3 py-2 w-64"
      />
      <button className="bg-indigo-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </form>
  )
}

export default SearchBar