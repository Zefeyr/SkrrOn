// app.js

// Import necessary functions from your initialization file (firebase-init.js)
import { 
    auth, 
    googleProvider,
    signInWithPopup,
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut 
} from './firebase-init.js';


// --- 1. HANDLE LOGOUT FUNCTION ---
const handleLogout = async () => {
    try {
        await signOut(auth);
        window.location.replace("signout.html");
    } catch (error) {
        console.error("Logout Failed:", error.message);
        alert(`Logout Failed: ${error.message}`);
    }
};


// --- 2. AUTH STATUS CHECK & PAGE PROTECTION ---
const setupAuthProtection = () => {
    const pathname = window.location.pathname;
    const isAuthPage = pathname.includes('login.html') || pathname.includes('signup.html');
    const isSignoutPage = pathname.includes('signout.html');

    const body = document.body;
    body.style.visibility = 'hidden'; 
    body.style.opacity = '0'; 

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // --- SCENARIO 1: USER IS LOGGED IN ---
            
            if (isAuthPage || isSignoutPage) { 
                window.location.replace("homepage.html"); 
            } else {
                // --- HOMEPAGE UI BLOCK START ---
                
                // 1. Get references to your Bootstrap dropdown elements
                const displayNameElem = document.getElementById('user-display-name');
                const emailElem = document.getElementById('user-email');
                const photoElem = document.getElementById('user-photo');
                const logoutButton = document.getElementById('logout-button');

                // 2. Populate data from Firebase/Google profile
                if (displayNameElem) {
                    // Use Google name if available, otherwise use the first part of the email
                    displayNameElem.textContent = user.displayName || user.email.split('@')[0];
                }

                if (emailElem) {
                    emailElem.textContent = user.email;
                }

                if (photoElem && user.photoURL) {
                    photoElem.src = user.photoURL;
                    photoElem.style.display = 'block'; // Ensure it's visible if hidden by default
                }

                // 3. Attach Logout Listener
                if (logoutButton) {
                    // We use a fresh listener here to ensure the dropdown link works correctly
                    logoutButton.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        handleLogout();
                    });
                }

                // Show content (Set to 'block' to prevent Flexbox breaking your homepage layout)
                body.style.display = 'block'; 
                body.style.visibility = 'visible'; 
                body.style.opacity = '1';
                
                // --- HOMEPAGE UI BLOCK END ---
            }
            
        } else {
            // --- SCENARIO 2: USER IS NOT LOGGED IN ---

            if (!isAuthPage && !isSignoutPage) { 
                window.location.replace("login.html");
            } else {
                // Auth pages use Flex for centering forms
                body.style.display = 'flex'; 
                body.style.visibility = 'visible'; 
                body.style.opacity = '1';
            }
        }
    });
};

// --- 3. GOOGLE SIGN-IN HANDLER ---
const handleGoogleLogin = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Google Sign-In Success:", result.user.email);
        window.location.replace("homepage.html"); 
    } catch (error) {
        console.error("Google Login Error:", error.code, error.message);
        displayMessage(`Google Login Failed: ${error.message}`, true);
    }
};


// --- Helper function to display messages ---
const displayMessage = (message, isError = true) => {
    if (isError) {
        console.error(message);
        alert(`Error: ${message}`);
    } else {
        console.log(message);
        alert(`Success: ${message}`);
    }
}

// --- Login Logic (For login.html) ---
const handleLogin = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-username').value; 
    const password = document.getElementById('login-password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            displayMessage(`Login Failed: ${error.message}`, true); 
        });
};

// --- Sign Up Logic (For signup.html) ---
const handleSignup = (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        displayMessage("Passwords do not match.", true);
        return;
    }
    
    createUserWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            displayMessage(`Signup Failed: ${error.message}`, true);
        });
};


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    setupAuthProtection(); 
    
    const signupForm = document.getElementById('signup-form'); 
    const loginForm = document.getElementById('login-form');
    const googleBtn = document.getElementById('google-login-button');
    const continueButton = document.getElementById('signout-continue-button');

    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);
    
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            window.location.replace("login.html");
        });
    }
});