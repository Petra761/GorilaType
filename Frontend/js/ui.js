
document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DE AUTENTICACIÓN ---
    const userAuth = document.getElementById('userAuth');
    const authModalContainer = document.getElementById('authModalContainer');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');
    
    // --- ELEMENTOS DEL JUEGO ---
    const languageSelect = document.getElementById('languageSelect');
    const modeSwitches = document.querySelectorAll('.modeSwitch');
    const wordOptionsContainer = document.getElementById('wordOptions');
    const timeOptionsContainer = document.getElementById('timeOptions');
    const wordCountButtons = document.querySelectorAll('.wordCount');
    const timeDurationButtons = document.querySelectorAll('.timeDuration');

    let gameConfig = { mode: 'words', value: 15, language: 'en' };
    
    const setupLoggedInUI = (username) => {
    // El nombre de usuario ahora es un enlace a la página de historial
    userAuth.innerHTML = `
        <a href="historial.html" id="historyLink" title="Ver mi historial">
            <span id="usernameDisplay">${username}</span>
        </a>
        <img src="assets/logout.svg" alt="Cerrar Sesión" id="logoutIcon" title="Cerrar Sesión">
    `;

    // Estilos para el nuevo enlace y el icono de logout
    const historyLink = document.getElementById('historyLink');
    historyLink.style.textDecoration = 'none';

    const logoutIcon = document.getElementById('logoutIcon');
    logoutIcon.style.width = '45px';
    logoutIcon.style.cursor = 'pointer';
    logoutIcon.style.filter = 'invert(85%) sepia(9%) saturate(466%) hue-rotate(145deg) brightness(85%) contrast(88%)';
    
    // Evento para cerrar sesión
    logoutIcon.addEventListener('click', () => {
        sessionStorage.removeItem('loggedInUser');
        window.location.reload(); // Recarga la página para restaurar la vista de "login"
    });
};

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        setupLoggedInUI(loggedInUser);
    }

    userAuth.addEventListener('click', () => {
        if (!sessionStorage.getItem('loggedInUser')) { authModalContainer.classList.remove('modal-hidden'); }
    });
    authModalContainer.addEventListener('click', (e) => {
        if (e.target === authModalContainer) { authModalContainer.classList.add('modal-hidden'); }
    });
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        loginError.textContent = '';
        if(registerError) registerError.textContent = '';
    });
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
        loginError.textContent = '';
        if(registerError) registerError.textContent = '';
    });

    // --- LÓGICA DE INICIO DE SESIÓN ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.textContent = '';
        const username = loginForm.querySelector('input[type="text"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;
        if (!username || !password) {
            loginError.textContent = 'Por favor, ingrese usuario y contraseña.';
            return;
        }
        try {
            const url = '/GorilaType/backend/jugador/login.php';
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            if (response.ok) {
                sessionStorage.setItem('loggedInUser', result.username);
                setupLoggedInUI(result.username);
            } else {
                loginError.textContent = result.error || `Error: ${response.status}`;
            }
        } catch (error) {
            loginError.textContent = 'No se pudo conectar con el servidor.';
        }
    });
    
    // --- LÓGICA DE REGISTRO (EL BLOQUE QUE FALTABA) ---
    if(registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if(!registerError) return;
            registerError.textContent = '';

            const username = registerForm.querySelector('input[type="text"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;
            
            if (!username || !password) {
                registerError.textContent = 'El usuario y la contraseña no pueden estar vacíos.';
                return;
            }
            if (password.length < 4) {
                 registerError.textContent = 'La contraseña debe tener al menos 4 caracteres.';
                 return;
            }

            try {
                const url = '/GorilaType/Backend/jugador/register.php';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await response.json();

                if (response.ok) { // Si el registro es exitoso (status 201)
                    // Iniciar sesión automáticamente
                    sessionStorage.setItem('loggedInUser', result.username);
                    setupLoggedInUI(result.username);
                } else { // Si hay un error (usuario duplicado, etc.)
                    registerError.textContent = result.error || `Error: ${response.status}`;
                }
            } catch (error) {
                registerError.textContent = 'No se pudo conectar con el servidor.';
            }
        });
    }

    // --- LÓGICA DE CONFIGURACIÓN DEL JUEGO ---
    function updateAndRestartGame() {
        if (!window.game) {
            console.error("El objeto 'game' no está disponible. No se puede reiniciar.");
            return;
        }
        game.gameMode = gameConfig.mode;
        game.language = gameConfig.language;
        if (gameConfig.mode === 'time') {
            game.duration = gameConfig.value;
            game.wordCount = 0;
        } else {
            game.wordCount = gameConfig.value;
            game.duration = 0;
        }
        game.restartGame();
        if (document.activeElement) document.activeElement.blur();
    }

    modeSwitches.forEach(button => {
        button.addEventListener('click', () => {
            const newMode = button.dataset.mode.toLowerCase();
            if (gameConfig.mode === newMode) return;
            gameConfig.mode = newMode;
            modeSwitches.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (newMode === 'words') {
                wordOptionsContainer.style.display = 'flex';
                timeOptionsContainer.style.display = 'none';
                const activeWordButton = document.querySelector('#wordOptions .active');
                if (activeWordButton) gameConfig.value = parseInt(activeWordButton.dataset.words);
            } else {
                wordOptionsContainer.style.display = 'none';
                timeOptionsContainer.style.display = 'flex';
                const activeTimeButton = document.querySelector('#timeOptions .active');
                if (activeTimeButton) gameConfig.value = parseInt(activeTimeButton.dataset.time);
            }
            updateAndRestartGame();
        });
    });

    wordCountButtons.forEach(button => {
        button.addEventListener('click', () => {
            wordCountButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameConfig.value = parseInt(button.dataset.words);
            updateAndRestartGame();
        });
    });

    timeDurationButtons.forEach(button => {
        button.addEventListener('click', () => {
            timeDurationButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameConfig.value = parseInt(button.dataset.time);
            updateAndRestartGame();
        });
    });

    languageSelect.addEventListener('change', (e) => {
        gameConfig.language = e.target.value;
        updateAndRestartGame();
    });

    // --- INICIALIZACIÓN ---
    document.querySelector('.modeSwitch[data-mode="words"]').classList.add('active');
    document.querySelector('.wordCount[data-words="15"]').classList.add('active');
    document.querySelector('.timeDuration[data-time="15"]').classList.add('active');

    if (window.game && typeof window.game.init === 'function') {
        game.init().then(() => {
            document.addEventListener('keydown', (e) => {
                if (authModalContainer.classList.contains('modal-hidden')) {
                    game.handleTyping(e);
                }
            });
        });
    } else {
        console.error("El objeto 'game' no se ha encontrado al cargar la página.");
    }
});
