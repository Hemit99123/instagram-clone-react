import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHoccjjXnyoWRtpGcoLzq61quor1iDiWc",
  authDomain: "instagram-clone-bad34.firebaseapp.com",
  projectId: "instagram-clone-bad34",
  storageBucket: "instagram-clone-bad34.appspot.com",
  messagingSenderId: "810951838734",
  appId: "1:810951838734:web:e50d899216453b28eec05f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app)