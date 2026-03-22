import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDsv8VFpcKaVndvCKM4cwOesRzQ2e5ptfo',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'adsquirrel2026.firebaseapp.com',
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://adsquirrel2026-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'adsquirrel2026',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'adsquirrel2026.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '56706206536',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:56706206536:web:90dbd76855f0adeb1c817d',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-FYC3YVZ8V4',
}

const app = initializeApp(firebaseConfig)

export const database = getDatabase(app)
