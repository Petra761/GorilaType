console.log("Script loaded");

class Game {
    constructor(config) {
        this.typingContainer = document.getElementById("typingContainer");
        this.progressElement = document.getElementById("gameProgress");
        this.wordsWrapper = null;

        this.gameMode = config.mode || 'time';
        this.language = config.language || 'en';
        this.duration = this.gameMode === 'time' ? config.value: 0;
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

    async init(){
        this.words = await this.loadWords();
        if (this.words.length > 0) {
            this.gameEnded = false;
            this.setEnvironment();
            this.UpdateProgressDisplay();
        }else{
            this.progressElement.textContent = "Error";
        }
    }
    
    // splitWords(cadena) {
    //     const words = cadena.split(' ');
    //     return this.randomizeWords(words);
    // }

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
            return randomizedWords
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
        } else if (this.gameMode === 'words') {
            const wordsToShow = Math.min(this.currentWordIndex, this.wordCount);
            this.progressElement.textContent = `${this.currentWordIndex + 1}/${this.wordCount}`;
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
        if (this.gameEnded) {
            return;
        }
        
        this.gameEnded = true;
        this.endTime = Date.now();
        clearInterval(this.timerId);

        if (this.gameMode === 'time') {
            this.progressElement.textContent = "Tiempo!";
        }else if (this.gameMode === 'words') {
            this.progressElement.textContent = `${this.wordCount}/${this.wordCount}`;
        }

        document.querySelectorAll(".cursor").forEach(cursor => cursor.classList.remove('cursor'));
        console.log("Game ended");
        this.calculateAndStoreResults();
    }

    handleTyping(e) {
        if (this.gameEnded) {
            return;
        }

        if (e.key.length === 1 && /[\p{L}0-9]/u.test(e.key)) {
            this.startTimer();
        }
        const activeWord = document.querySelector('.wordActive');
        const letters = activeWord.querySelectorAll('.letter');


        if (e.key === 'Backspace') {
            if (this.charIndex > 0) {
                this.charIndex--;
                const letterToRemove = letters[this.charIndex];
                if (letterToRemove.classList.contains('extra')) {
                    letterToRemove.remove();
                } else {
                    letterToRemove.classList.remove('correct', 'incorrect');
                }
            }else {
                if (this.currentWordIndex > 0) {
                    this.moveToPreviousWord();
                }
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
                    this.totalChars++;
                } else {
                    currentLetter.classList.add('incorrect');
                    this.incorrectChars++;
                    this.totalChars++;
                }
                this.charIndex++;
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
        const currentWordElement = words[this.currentWordIndex];

        if (this.isCorrectWord(currentWordElement)) {
            currentWordElement.classList.add('wordCorrect');
        }

        const extraCursor = document.querySelector('.extra-cursor');
        if (extraCursor) extraCursor.remove();

        if (this.currentWordIndex === words.length - 1) {
            if (this.gameMode === 'words') {
                this.currentWordIndex++;
                this.UpdateProgressDisplay();
                this.endGame();
            }
            return;
        }

        words[this.currentWordIndex].classList.remove('wordActive');
        this.currentWordIndex++;
        this.charIndex = 0;
        words[this.currentWordIndex].classList.add('wordActive');

        this.updateCursor();
        this.handleScroll('next');
        this.UpdateProgressDisplay();
    }

    moveToPreviousWord() {
        const words = document.querySelectorAll('.word');
        if (this.currentWordIndex === 0) return;
        const previousWordElement = words[this.currentWordIndex - 1];
        if (previousWordElement.classList.contains('wordCorrect')) return;

        this.handleScroll('previous');

        words[this.currentWordIndex].classList.remove('wordActive');
        this.currentWordIndex--;

        const activeWord = words[this.currentWordIndex];
        activeWord.classList.add('wordActive');

        const letters = activeWord.querySelectorAll('.letter');
        let newCharIndex = 0;

        for (let i = 0; i < letters.length; i++) {
            const letter = letters[i];

            if (letter.classList.contains('correct') || letter.classList.contains('incorrect')) {
                newCharIndex= 1+i;
            }else{
                break;
            }
        }
        this.charIndex = newCharIndex;
        this.updateCursor();
        this.UpdateProgressDisplay();
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

    calculateAndStoreResults() {
        let timeElapsedInMinutes;

        if (this.gameMode === 'time') {
            timeElapsedInMinutes = this.duration / 60;
        } else if (this.gameMode === 'words') {
            const timeElapsedInSeconds = (this.endTime - this.startTime) / 1000;
            timeElapsedInMinutes = timeElapsedInSeconds / 60;
        }

        if (timeElapsedInMinutes <= 0) {
            console.log("No se ha completado suficiente tiempo o texto para calcular el resultado.");
            // Opcional: Redirigir igualmente o mostrar un mensaje.
            // Por ahora, no haremos nada si no hay tiempo transcurrido.
            return;
        }

        const wpm = Math.round((this.correctChars / 5) / timeElapsedInMinutes) || 0;
        const cpm = Math.round(this.correctChars / timeElapsedInMinutes) || 0;
        const accuracy = this.totalChars > 0 ? ((this.correctChars / this.totalChars) * 100).toFixed(2) : "0.00";
    
        const results = {
            wpm: wpm,
            cpm: cpm,
            accuracy: accuracy
        };

        // Guardar en localStorage
        localStorage.setItem('typingTestResults', JSON.stringify(results));

        // Redirigir a la página de resultados
        window.location.href = 'results.html';
    }

    async restartGame() {
        console.log("Reiniciando el juego...");
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

    
    isCorrectWord(wordElement){
        if (wordElement.querySelector('.extra')){
            return false;
        }

        const letters = wordElement.querySelectorAll('.letter');
        const origialWord = this.words[this.currentWordIndex];
        
        for (let i = 0; i < letters.length; i++) {
            if (!letters[i].classList.contains('correct')) {
                return false;
            }
        }

        return letters.length === origialWord.length;
    }
}

const initialConfig = {
    mode: 'words',
    value: 15,
    language: 'en'
};

let game = new Game(initialConfig);


const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', () => {
    game.restartGame();
    restartButton.blur();
});