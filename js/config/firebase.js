export const firebaseConfig = {
    apiKey: "AIzaSyD1DL0W7gZvjwRp6EBBp25Kr0qFFH0z3SI",
    authDomain: "guest-calendar-d4a1d.firebaseapp.com",
    projectId: "guest-calendar-d4a1d",
    storageBucket: "guest-calendar-d4a1d.firebasestorage.app",
    messagingSenderId: "23668340445",
    appId: "1:23668340445:web:c58ea8bfe3d171af694d34"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();