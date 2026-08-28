import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0417841512",
  appId: "1:179044081688:web:b4ec53bce7be340f23a36d",
  apiKey: "AIzaSyBSMaIEVLLI2GLKDqifN5DR3HpUS_sgNzc",
  authDomain: "gen-lang-client-0417841512.firebaseapp.com",
  storageBucket: "gen-lang-client-0417841512.firebasestorage.app",
  messagingSenderId: "179044081688"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app, "ai-studio-5a950ff3-89b9-40a0-beb5-a8238168aa4b");
