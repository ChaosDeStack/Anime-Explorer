import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Settings are read from the .env file, so no secrets are in the code.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Connects our app to our Firebase project
const app = initializeApp(firebaseConfig)

// auth handles login, register and logout
export const auth = getAuth(app)

// Lets users sign in with their Google account
export const googleProvider = new GoogleAuthProvider()

// db is our Firestore database (where watchlists are saved)
export const db = getFirestore(app)