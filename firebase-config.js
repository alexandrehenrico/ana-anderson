// Firebase config - Ana & Anderson
const firebaseConfig = {
    apiKey: "AIzaSyDfTNb8UagXo5oNd20-D8HVCAlu-HHyz34",
    authDomain: "ana-anderson.firebaseapp.com",
    projectId: "ana-anderson",
    storageBucket: "ana-anderson.firebasestorage.app",
    messagingSenderId: "709370385561",
    appId: "1:709370385561:web:5af52f5f39412003585408"
};

firebase.initializeApp(firebaseConfig);
window.db = firebase.firestore();
