// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAeA92bKST_oMfhKqqKuaUh7eN5Qdqg1BQ",
  authDomain: "fisherpaykel-utm-builder-app.firebaseapp.com",
  projectId: "fisherpaykel-utm-builder-app",
  storageBucket: "fisherpaykel-utm-builder-app.firebasestorage.app",
  messagingSenderId: "98977816783",
  appId: "1:989778167843:web:96555b3ed1149a7a6dc996",
  measurementId: "G-DZ6MCDJVDY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
