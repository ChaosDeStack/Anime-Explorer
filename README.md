# Anime Explorer

A responsive React web app for discovering anime. Search by name, read details, and save your favourites to a personal watchlist after logging in.

**Live demo:** https://anime-explorer-black.vercel.app/

**Figma wireframes:** https://www.figma.com/design/uGQ23W0F5a1liUJIXzCJCh/Anime-Explorer?node-id=0-1&t=u654wskfJvgi6UR3-1

## Features

- Search anime by name, with the search word kept in the URL so the results survive going back and forth
- Details page with poster, score, episodes, genres and synopsis
- Register and log in with **email and password** or **Google**
- **Protected watchlist page**: only logged-in users can open it
- Add anime to a watchlist, change its status (Plan to watch, Watching, Completed) and remove it
- Watchlist saved in **Firebase Firestore**, so it stays after refreshing and works on any device
- Loading, error and empty states, plus form validation with friendly messages
- Responsive layout for phones, tablets and desktops
- Accessible forms (labels, `role="alert"` errors, keyboard friendly)

## Tech stack

| Area | Tools |
|---|---|
| Framework | React (Vite) |
| Styling | Tailwind CSS (dark theme with a rose and cyan complementary colour scheme) |
| Routing | React Router |
| Global state | Context API (`AuthContext`) |
| Authentication | Firebase Authentication (email/password and Google) |
| Database | Firebase Firestore |
| External API | Jikan v4 anime API (through a v4-compatible mirror) |
| Testing | Vitest and React Testing Library |
| CI/CD | GitHub Actions and Vercel |
| Design | Figma (wireframes) |

## User stories

1. As a user, I should be able to register and log in with email/password or Google.
2. As a user, I should be able to search anime by name.
3. As a user, I should be able to view an anime's details (synopsis, score, episodes, genres).
4. As a logged-in user, I should be able to add, update and remove anime in my watchlist.
5. As a logged-out user, I should be redirected to the login page when I open the watchlist.
6. As a user, I should see a loading message while data loads and an error message if it fails.

## Project structure

```
src/
├── components/     Navbar, SearchBar, AnimeCard, AnimeList, ProtectedRoute
├── context/        AuthContext (login state shared across the app)
├── pages/          Home, AnimeDetails, Login, Register, Watchlist
├── services/       jikan.js (API requests), watchlist.js (Firestore CRUD)
├── firebase.js     Firebase setup (reads keys from environment variables)
├── App.jsx         Routes
└── main.jsx        App entry point
```

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/ChaosDeStack/Anime-Explorer.git
cd Anime-Explorer
npm install
```

### 2. Set up Firebase

1. Create a project at the [Firebase console](https://console.firebase.google.com).
2. Add a **web app** and copy its config values.
3. Enable **Authentication**, then turn on the **Email/Password** and **Google** sign-in methods.
4. Create a **Firestore Database** and publish these security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/watchlist/{animeId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. Add environment variables

Create a file named `.env` in the project root (it is ignored by git, so your keys stay private). Use `.env.example` as a template:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### 4. Run the app

```bash
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`).

## Testing

```bash
npm test            # run all tests
npm run coverage    # run tests and show the coverage report
```

The project has 14 test files and 53 tests. Coverage is above 95%, and the build fails if it drops below 65%. Firebase and the API are mocked, so the tests run without internet or real keys.

## CI/CD and deployment

- **GitHub Actions** (`.github/workflows/ci.yml`) installs the dependencies, runs the tests with the coverage check, and builds the app on every push and pull request.
- **Vercel** deploys the app automatically whenever `main` is updated. The Firebase keys are stored as Vercel environment variables, never in the repository.
- `vercel.json` rewrites all URLs to `index.html` so React Router pages still work after a refresh.

## API note

Anime data comes from the [Jikan API](https://jikan.moe) (an unofficial MyAnimeList API). The app uses a Jikan v4-compatible mirror (`https://api.tenrai.org/v1`) because the main Jikan address was unreachable on my network. To use the original, change `BASE_URL` in `src/services/jikan.js` to `https://api.jikan.moe/v4`.

## Development workflow

Every feature was built on its own branch and merged through a pull request. Tasks were tracked on a GitHub Projects board (To Do, In Progress, In Review, Done).

## Author

**Andrew Maina**, GitHub: [@ChaosDeStack](https://github.com/ChaosDeStack)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.