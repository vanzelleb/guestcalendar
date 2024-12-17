import { signInOrSignUp, signOut } from '../services/authService.js';

export function initializeAuthUI() {
    const loginForm = document.getElementById('loginForm');
    const userInfo = document.getElementById('userInfo');
    const userEmail = document.getElementById('userEmail');

    return {
        showLoggedIn(user) {
            userInfo.style.display = 'block';
            loginForm.style.display = 'none';
            userEmail.textContent = user.email;
        },
        showLoggedOut() {
            userInfo.style.display = 'none';
            loginForm.style.display = 'block';
        }
    };
}

export async function handleAuth() {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    
    try {
        await signInOrSignUp(email, name);
    } catch (error) {
        alert(error.message);
    }
}

export function handleSignOut() {
    signOut().catch(error => alert('Error signing out: ' + error.message));
}