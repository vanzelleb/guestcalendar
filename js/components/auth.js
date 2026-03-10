import { signInOrSignUp, signOut } from '../services/authService.js';
import { SELECTORS } from '../config/constants.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function initializeAuthUI() {
    const loginForm = document.getElementById(SELECTORS.LOGIN_FORM.slice(1));
    const userInfo = document.getElementById(SELECTORS.USER_INFO.slice(1));
    const userEmail = document.getElementById(SELECTORS.USER_EMAIL.slice(1));

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

export async function handleAuth(event) {
    event?.preventDefault();

    const email = document.getElementById(SELECTORS.EMAIL_INPUT.slice(1)).value.trim();
    const name = document.getElementById(SELECTORS.NAME_INPUT.slice(1)).value.trim();

    if (!validateInputs(email, name)) {
        return;
    }

    try {
        await signInOrSignUp(email, name);
    } catch (error) {
        alert(error.message);
    }
}

export function handleSignOut() {
    signOut().catch(error => alert('Error signing out: ' + error.message));
}

function validateInputs(email, name) {
    if (!email || !name) {
        alert('Please fill in all fields');
        return false;
    }

    if (!EMAIL_REGEX.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (name.length < 2) {
        alert('Name must be at least 2 characters');
        return false;
    }

    return true;
}