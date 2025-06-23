// public/auth.js

// Import the 'auth' instance from your firebase-init.js
import { auth } from './firebase-init.js';

// IMPORTANT: Import the specific Firebase Auth functions using their CDN URLs
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js"; // <-- THIS IS THE CRITICAL LINE

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const messageDiv = document.getElementById('message');

    const displayMessage = (msg, type = 'error') => {
        messageDiv.textContent = msg;
        messageDiv.className = `message ${type}`;
        messageDiv.style.display = 'block';
    };

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupForm.elements.email.value;
            const password = signupForm.elements.password.value;

            try {
                // Correct usage: Pass 'auth' instance as the first argument to the imported function
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, uid: user.uid })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to sign up on backend.');
                }

                displayMessage('Account created successfully! Redirecting to login...', 'success');
                window.location.href = '/login.html';

            } catch (error) {
                console.error('Signup error:', error);
                displayMessage(error.message || 'Signup failed.');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.elements.email.value;
            const password = loginForm.elements.password.value;

            try {
                // Correct usage: Pass 'auth' instance as the first argument to the imported function
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const idToken = await userCredential.user.getIdToken();

                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idToken })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new new Error(errorData.error || 'Failed to login on backend.');
                }

                displayMessage('Logged in successfully! Redirecting to dashboard...', 'success');
                window.location.href = '/index.html';

            } catch (error) {
                console.error('Login error:', error);
                displayMessage(error.message || 'Login failed. Check your credentials.');
            }
        });
    }
});