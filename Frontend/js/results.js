document.addEventListener('DOMContentLoaded', () => {
    // --- NUEVO: Lógica de Sesión (copiada de ui.js) ---
    const userAuthDiv = document.getElementById('userAuth');
    const authModalContainer = document.getElementById('authModalContainer');
    const loginForm = document.getElementById('loginForm');

    const setupLoggedInUI = (username) => {
        userAuthDiv.innerHTML = `
            <span class="loggedIn-user">${username}</span>
            <img src="assets/logout.svg" alt="Cerrar Sesión" id="logoutIcon" title="Cerrar Sesión">
        `;
        document.getElementById('logoutIcon').addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUser');
            // Al cerrar sesión desde resultados, volver al inicio
            window.location.href = 'index.html';
        });
    };

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        setupLoggedInUI(loggedInUser);
    } else {
        const loginIcon = document.getElementById('loginIcon');
        if(loginIcon) {
            loginIcon.addEventListener('click', () => {
                authModalContainer.classList.remove('modal-hidden');
            });
            // Aquí no se necesita la lógica de envío del form,
            // ya que el login principal ocurre en index.html
        }
    }
    // --- Fin de la Lógica de Sesión ---

    // --- Lógica de Resultados (sin cambios) ---
    const wpmValueEl = document.getElementById('wpmValue');
    const cpmValueEl = document.getElementById('cpmValue');
    const accuracyValueEl = document.getElementById('accuracyValue');

    const results = JSON.parse(localStorage.getItem('typingTestResults'));

    if (results) {
        wpmValueEl.textContent = results.wpm;
        cpmValueEl.textContent = results.cpm;
        accuracyValueEl.textContent = `${results.accuracy}%`;
    } else {
        wpmValueEl.textContent = 'N/A';
        cpmValueEl.textContent = 'N/A';
        accuracyValueEl.textContent = 'N/A';
    }
});