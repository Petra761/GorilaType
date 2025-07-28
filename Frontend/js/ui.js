document.addEventListener('DOMContentLoaded',() => {



// --- Auth Modal Logic ---
    const authLink = document.getElementById('authLink');
    const authModalContainer = document.getElementById('authModalContainer');
    const authModal = document.getElementById('authModal');
    
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // loginIcon.addEventListener('click', () => {
    //     authModalContainer.classList.remove('modal-hidden');
    // });

    authModalContainer.addEventListener('click', (e) => {
        if (e.target === authModalContainer) {
            authModalContainer.classList.add('modal-hidden');
        }
    });

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
        registerForm.style.display = 'flex';
        loginForm.style.display = 'none';
    });





    const languageSelect = document.getElementById('languageSelect');
    const modeSwitches = document.querySelectorAll('.modeSwitch');
    const wordOptionsContainer = document.getElementById('wordOptions');
    const timeOptionsContainer = document.getElementById('timeOptions');
    const wordCountButtons = document.querySelectorAll('.wordCount');
    const timeDurationButtons = document.querySelectorAll('.timeDuration');

    let gameConfig = {
        mode: 'words',
        value: 15,
        language: 'en'
    };

    function updateAndRestartGame() {
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
            const newMode = button.dataset.mode;
            gameConfig.mode = newMode.toLowerCase();

            modeSwitches.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (gameConfig.mode === 'words') {
                wordOptionsContainer.style.display = 'block';
                timeOptionsContainer.style.display = 'none';
                gameConfig.value = parseInt(document.querySelector('.wordCount.active').dataset.words);
            } else {
                wordOptionsContainer.style.display = 'none';
                timeOptionsContainer.style.display = 'block';
                gameConfig.value = parseInt(document.querySelector('.timeDuration.active').dataset.time);
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

    document.querySelector('.modeSwitch[data-mode="words"]').classList.add('active');
    document.querySelector('.wordCount[data-words="15"]').classList.add('active');
    document.querySelector('.timeDuration[data-time="15"]').classList.add('active');

    game.init().then(() => {
        document.addEventListener('keydown', (e) => {
            game.handleTyping(e);
        });
    });
});