// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWytknJeI4UJIUdzta8PH-3RBZztqFnjk",
    authDomain: "joinapp-28ae7.firebaseapp.com",
    databaseURL: "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "joinapp-28ae7",
    storageBucket: "joinapp-28ae7.firebasestorage.app",
    messagingSenderId: "499384970755",
    appId: "1:499384970755:web:c473c1b2b62d140d676836"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Realtime Database
const db = getDatabase(app);

/**
 * Retrieves user data from the Firebase Realtime Database.
 * @param {string} userId - The ID of the user to retrieve data for.
 */
function getUserData(userId) {
    const dbRef = ref(db); 
    const userPath = `users/${userId}`;

    get(child(dbRef, userPath))
        .then((snapshot) => {
            if (snapshot.exists()) {
                console.log("User Data:", snapshot.val());
            } else {
                console.log("No data available for the given user ID.");
            }
        })
        .catch((error) => {
            console.error("Error retrieving user data:", error);
        });
}

// Example usage of getUserData
getUserData("user"); 
