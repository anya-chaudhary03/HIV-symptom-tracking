// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

if (typeof window !== 'undefined') {
    console.log(window.navigator.userAgent);
  }
const firebaseConfig = {
  apiKey: "AIzaSyAbl2PJTLZjyXGQOsuarVE6TvnE5ze0H2o",
  authDomain: "hiv-symptom-tracking.firebaseapp.com",
  projectId: "hiv-symptom-tracking",
  storageBucket: "hiv-symptom-tracking.firebasestorage.app",
  messagingSenderId: "333104196734",
  appId: "1:333104196734:web:10bb4083dca338c4fdbc2f",
  measurementId: "G-DCBSHNSX76"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export const fb_analytics = analytics

export const fb_auth = getAuth(app)
export const fb_db = getFirestore(app)

//const analytics = getAnalytics(app);