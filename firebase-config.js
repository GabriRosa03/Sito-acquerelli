// Configurazione Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB4Z8tsgWeExOlnSlI0c1cVoqSMj2h9SVg",
    authDomain: "sitoacquerelli.firebaseapp.com",
    databaseURL: "https://sitoacquerelli-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sitoacquerelli",
    storageBucket: "sitoacquerelli.firebasestorage.app",
    messagingSenderId: "306839509856",
    appId: "1:306839509856:web:d151a1fae13e2caa5d9c05",
    measurementId: "G-5Q3C10E7ZE"
};

// Inizializza Firebase (versione compat)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const analytics = firebase.analytics();