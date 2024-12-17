import { onAuthStateChanged } from './services/authService.js';
import { initializeAuthUI, handleAuth, handleSignOut } from './components/auth.js';
import { renderCalendar } from './components/calendar.js';
import { setCurrentUser } from './store/userStore.js';

const authUI = initializeAuthUI();

// Make auth handlers available globally
window.handleAuth = handleAuth;
window.handleSignOut = handleSignOut;

// Auth state observer
onAuthStateChanged((user) => {
    setCurrentUser(user);
    if (user) {
        authUI.showLoggedIn(user);
    } else {
        authUI.showLoggedOut();
    }
    renderCalendar();
});