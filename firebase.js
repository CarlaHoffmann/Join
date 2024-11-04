
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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

  import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

  const db = getDatabase(app);

function getUserData(userId) {
    const path = "https://joinapp-28ae7-default-rtdb.europe-west1.firebasedatabase.app/";
    const dbRef = ref(db);
    get(child(dbRef, path)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error(error);
    });
}

getUserData("user");
