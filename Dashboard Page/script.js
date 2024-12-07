import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCDD_suBufBLAXzLjV0YPoIq1XU_nOVaBQ",
    authDomain: "easycab-71fcf.firebaseapp.com",
    databaseURL: "https://easycab-71fcf-default-rtdb.firebaseio.com",
    projectId: "easycab-71fcf",
    storageBucket: "easycab-71fcf.appspot.com",
    messagingSenderId: "621065707054",
    appId: "1:621065707054:web:8b47875a751d361f2e09bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sidebar toggle functionality
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
});

// Get the current logged-in driver
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const driverId = user.uid;
        const docRef = doc(db, "drivers", driverId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const driverData = docSnap.data();
            document.getElementById('driverName').textContent = driverData.name;
            document.getElementById('driverEmail').textContent = driverData.email;
            document.getElementById('driverPhone').textContent = driverData.phone;
            document.getElementById('driverLicense').textContent = driverData.license;
            document.getElementById('taxiNumber').textContent = driverData.taxiNumber;
            document.getElementById('driverAddress').textContent = driverData.address;
            document.getElementById('driverPic').src = driverData.picUrl;

            // Generate QR Code with driver UID for redirection
            const qrCodeData = `https://cabdriver.easycab.site/Dashboard%20Page/driver-details.html?uid=${driverData.uid}`; // URL for redirection
            new QRCode(document.getElementById('qrcode'), {
                text: qrCodeData, // The URL for redirection
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H,
            });
        } else {
            console.log("No such driver found!");
        }
    } else {
        console.log("No user is logged in.");
    }
});

// Get the logout button and set up the click listener
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', async () => {
    const auth = getAuth();
    
    try {
        // Sign out the user
        await signOut(auth);
        console.log('User signed out.');

        // Redirect to the login page
        window.location.href = '../Login Page/index.html';

        // Prevent back navigation
        window.history.replaceState(null, '', '../Login Page/index.html');  // Replace the current history entry with the login page

    } catch (error) {
        console.error('Error signing out: ', error);
    }
});