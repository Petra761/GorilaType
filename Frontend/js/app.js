
console.log("Script app.js loaded");

class Game {

    
    constructor(config) {
        this.typingContainer = document.getElementById("typingContainer");
        this.progressElement = document.getElementById("gameProgress");
        this.wordsWrapper = null;
        this.gameMode = config.mode || 'time';
        this.language = config.language || 'en';
        this.duration = this.gameMode === 'time' ? config.value : 0;
        this.wordCount = this.gameMode === 'words' ? config.value : 0;
        this.words = [];
        this.currentWordIndex = 0;
        this.charIndex = 0;
        this.gameEnded = true;
        this.timeRemaining = this.duration;
        this.timerId = null;
        this.timerStarted = false;
        this.startTime = 0;
        this.endTime = 0;
        this.correctChars = 0;
        this.incorrectChars = 0;
        this.totalChars = 0;
        this.currentLine = 1;
        this.scrollOffset = 0;
    }

    async init() {
        this.words = await this.loadWords();
        if (this.words.length > 0) {
            this.gameEnded = false;
            this.setEnvironment();
            this.UpdateProgressDisplay();
        } else {
            this.progressElement.textContent = "Error";
        }
    }

    async loadWords() {
        const ruta = `data/${this.language}_level1.json`;
        try {
            const response = await fetch(ruta);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const randomizedWords = this.randomizeWords(data);
            if (this.gameMode === 'words') {
                return randomizedWords.slice(0, this.wordCount);
            }
            return randomizedWords;
        } catch (error) {
            console.error("Error fetching words:", error);
            return [];
        }
    }

    randomizeWords(words) {
        const shuffledWords = words.slice();
        for (let i = shuffledWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledWords[i], shuffledWords[j]] = [shuffledWords[j], shuffledWords[i]];
        }
        return shuffledWords;
    }

    setEnvironment() {
        this.typingContainer.innerHTML = '';
        this.wordsWrapper = document.createElement('div');
        this.wordsWrapper.id = 'wordsWrapper';
        this.words.forEach((word, wordIndex) => {
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word';
            if (wordIndex === 0) {
                wordDiv.classList.add('wordActive');
            }
            word.split('').forEach((char) => {
                const letter = document.createElement('span');
                letter.classList.add('letter');
                letter.textContent = char;
                wordDiv.appendChild(letter);
            });
            this.wordsWrapper.appendChild(wordDiv);
        });
        this.typingContainer.appendChild(this.wordsWrapper);
        this.updateCursor();
    }

    UpdateProgressDisplay() {
        if (this.gameMode === 'time') {
            this.progressElement.textContent = this.timeRemaining;
        } else if (this.gameMode === 'words' && this.wordCount > 0) {
            this.progressElement.textContent = `${this.currentWordIndex}/${this.wordCount}`;
        }
    }

    startTimer() {
        if (this.timerStarted) return;
        this.timerStarted = true;
        this.startTime = Date.now();
        if (this.gameMode === 'time') {
            this.timerId = setInterval(() => {
                this.timeRemaining--;
                this.UpdateProgressDisplay();
                if (this.timeRemaining <= 0) {
                    this.endGame();
                }
            }, 1000);
        }
    }

    endGame() {
        if (this.gameEnded) return;
        this.gameEnded = true;
        this.endTime = Date.now();
        clearInterval(this.timerId);
        if (this.gameMode === 'time') {
            this.progressElement.textContent = "¡Tiempo!";
        } else if (this.gameMode === 'words' && this.wordCount > 0) {
            this.progressElement.textContent = `${this.wordCount}/${this.wordCount}`;
        }
        document.querySelectorAll(".cursor").forEach(cursor => cursor.classList.remove('cursor'));
        this.calculateAndStoreResults();
    }

    handleTyping(e) {
        if (this.gameEnded) return;
        if (e.key.length === 1 && /[\p{L}0-9]/u.test(e.key)) {
            this.startTimer();
        }
        const activeWord = document.querySelector('.wordActive');
        if (!activeWord) return;
        const letters = activeWord.querySelectorAll('.letter');
        if (e.key === 'Backspace') {
            if (this.charIndex > 0) {
                this.charIndex--;
                const letterToRemove = letters[this.charIndex];
                if (letterToRemove && letterToRemove.classList.contains('extra')) {
                    letterToRemove.remove();
                } else if (letterToRemove) {
                    letterToRemove.classList.remove('correct', 'incorrect');
                }
            } else if (this.currentWordIndex > 0) {
                this.moveToPreviousWord();
            }
        } else if (e.key === ' ') {
            if (this.charIndex > 0 || letters.length === 0) {
                this.moveToNextWord();
            }
        } else if (e.key.length === 1 && /[\p{L}0-9]/u.test(e.key)) {
            if (this.charIndex < letters.length) {
                const currentLetter = letters[this.charIndex];
                if (e.key === currentLetter.textContent) {
                    currentLetter.classList.add('correct');
                    this.correctChars++;
                } else {
                    currentLetter.classList.add('incorrect');
                    this.incorrectChars++;
                }
                this.charIndex++;
                this.totalChars++;
            } else {
                const extraLetter = document.createElement('span');
                extraLetter.className = 'letter incorrect extra';
                extraLetter.textContent = e.key;
                activeWord.appendChild(extraLetter);
                this.charIndex++;
                this.incorrectChars++;
                this.totalChars++;
            }
        }
        this.updateCursor();
    }

    moveToNextWord() {
        const words = document.querySelectorAll('.word');
        if (this.gameMode === 'words' && this.currentWordIndex >= this.wordCount - 1) {
             this.endGame();
             return;
        }
        if (this.currentWordIndex >= words.length - 1) return;
        words[this.currentWordIndex].classList.remove('wordActive');
        this.currentWordIndex++;
        this.charIndex = 0;
        words[this.currentWordIndex].classList.add('wordActive');
        this.updateCursor();
        this.handleScroll('next');
        if (this.gameMode === 'words') this.UpdateProgressDisplay();
    }

    calculateAndStoreResults() {
        let timeElapsedInMinutes;
        if (this.gameMode === 'time') {
            timeElapsedInMinutes = this.duration / 60;
        } else {
            const timeElapsedInSeconds = (this.endTime - this.startTime) / 1000;
            timeElapsedInMinutes = timeElapsedInSeconds > 0 ? timeElapsedInSeconds / 60 : 0;
        }

        if (timeElapsedInMinutes <= 0) {
            console.log("Tiempo insuficiente para calcular resultados.");
            return;
        }

        const wpm = Math.round((this.correctChars / 5) / timeElapsedInMinutes) || 0;
        const cpm = Math.round(this.correctChars / timeElapsedInMinutes) || 0;
        const accuracy = this.totalChars > 0 ? ((this.correctChars / this.totalChars) * 100).toFixed(2) : "0.00";
        const results = { wpm, cpm, accuracy };
        
        const loggedInUser = sessionStorage.getItem('loggedInUser');
        if (loggedInUser) {
            const gameData = {
                username: loggedInUser,
                wpm: results.wpm,
                cpm: results.cpm,
                accuracy: parseFloat(results.accuracy)
            };
            this.saveGameDataToServer(gameData); // Llamada a la función de guardado
        }

        localStorage.setItem('typingTestResults', JSON.stringify(results));
        window.location.href = 'results.html';
    }

    async saveGameDataToServer(gameData) {
    console.log("Intentando guardar los datos del juego:", gameData);
    try {
        const url = '/GorilaType/backend/partida/save-game.php';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gameData)
        });
        if (response.ok) {
            const result = await response.json();
            console.log("Respuesta del servidor:", result.message);
        } else {
            const errorResult = await response.json();
            console.error("Error al guardar la partida:", errorResult.error);
        }
    } catch (error) {
        console.error("Error de red al intentar guardar la partida:", error);
    }
}
    
    async restartGame() {
        console.log("Reiniciando el juego con la nueva configuración...");
        clearInterval(this.timerId);
        this.timeRemaining = this.duration;
        this.timerStarted = false;
        this.gameEnded = true;
        this.startTime = 0;
        this.endTime = 0;
        this.currentWordIndex = 0;
        this.charIndex = 0;
        this.correctChars = 0;
        this.incorrectChars = 0;
        this.totalChars = 0;
        this.currentLine = 1;
        this.scrollOffset = 0;
        if (this.wordsWrapper) {
            this.wordsWrapper.style.transform = 'translateY(0px)';
        }
        this.typingContainer.innerHTML = '';
        await this.init();
    }

    updateCursor() {
        document.querySelectorAll('.cursor').forEach(cursor => cursor.classList.remove('cursor'));
        const activeWord = document.querySelector('.wordActive');
        if (activeWord) {
            const letters = activeWord.querySelectorAll('.letter');
            if (this.charIndex < letters.length) {
                letters[this.charIndex].classList.add('cursor');
            } else {
                const cursorSpan = document.createElement('span');
                cursorSpan.className = 'cursor extra-cursor';
                activeWord.appendChild(cursorSpan);
            }
        }
    }
    
    moveToPreviousWord() {
        const words = document.querySelectorAll('.word');
        
        if (this.currentWordIndex <= 0) return;

        const previousWordElement = words[this.currentWordIndex - 1];

        if (this.isCorrectWord(previousWordElement)) {
            return; 
        }

        this.handleScroll('previous');
        words[this.currentWordIndex].classList.remove('wordActive');
        
        this.currentWordIndex--;

        const newActiveWord = words[this.currentWordIndex];
        newActiveWord.classList.add('wordActive');

        this.charIndex = newActiveWord.querySelectorAll('.letter').length;
        
        this.updateCursor();
        if (this.gameMode === 'words') {
        this.UpdateProgressDisplay();
        }
    }

    handleScroll(direction) {
        const words = this.wordsWrapper.querySelectorAll('.word');
        const currentWordEl = words[this.currentWordIndex];
        
        if (direction === 'next') {
            if (this.currentWordIndex === 0) return;
            
            const prevWordEl = words[this.currentWordIndex - 1];
            
            if (currentWordEl.offsetTop > prevWordEl.offsetTop) {
                this.currentLine++;
            }
            
            if (this.currentLine > 2) {
                const scrollAmount = currentWordEl.offsetTop - prevWordEl.offsetTop;
                this.scrollOffset += scrollAmount;
                this.wordsWrapper.style.transform = `translateY(-${this.scrollOffset}px)`;  
                this.currentLine--; 
            }
        } 
        else if (direction === 'previous') {
            const nextWordEl = words[this.currentWordIndex];
            const newActiveWordEl = words[this.currentWordIndex - 1];
            
            if (newActiveWordEl.offsetTop < nextWordEl.offsetTop) {
                
                if (this.currentLine === 2 && this.scrollOffset > 0) {
                    const scrollAmount = nextWordEl.offsetTop - newActiveWordEl.offsetTop;
                    this.scrollOffset -= scrollAmount;
                    
                    this.scrollOffset = Math.max(0, this.scrollOffset); 
                    
                    this.wordsWrapper.style.transform = `translateY(-${this.scrollOffset}px)`;
                    this.currentLine++; 
                }
                
                this.currentLine--;
            }
        }
    }
    isCorrectWord(wordElement) {
        if (!wordElement) return false;

        if (wordElement.querySelector('.extra')) {
            return false;
        }

        const letters = wordElement.querySelectorAll('.letter');
        
        for (const letter of letters) {

            if (letter.classList.contains('incorrect') || !letter.classList.contains('correct')) {
                return false;
            }
        }

        return true;
    }
}

const initialConfig = {
    mode: 'words',
    value: 15,
    language: 'en'
};
let game = new Game(initialConfig);

window.game = game;

const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', () => {
    game.restartGame();
    restartButton.blur();
});
