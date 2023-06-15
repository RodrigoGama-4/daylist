// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD0Zb8DGm0jLnLST49QEoGtuU-Lv8AOqGU',
  authDomain: 'daylist-todo.firebaseapp.com',
  projectId: 'daylist-todo',
  storageBucket: 'daylist-todo.appspot.com',
  messagingSenderId: '475734162021',
  appId: '1:475734162021:web:eda8f23de857da9c9a648c',
  measurementId: 'G-JMR8LPSZK5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const bucket = getStorage(app);
