console.log("Script loaded");

class Game {
    constructor(duration) {
        this.typingContainer = document.getElementById("typingContainer");
        this.timerElement = document.getElementById("timer");

        this.wordsWrapper = null;

        this.words = [];
        this.currentWordIndex = 0;
        this.charIndex = 0;

        this.duration = duration;
        this.timeRemaining = duration;
        this.timerId = null;
        this.gameEnded = true;

        this.timerStarted = false;

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
            this.timerElement.textContent = this.duration;
        }else{
            this.timerElement.textContent = "Error";
        }
    }
    
    splitWords(cadena) {
        const words = cadena.split(' ');
        return this.randomizeWords(words);
    }

    async loadWords() {
        const ruta = 'data/en_level1.json';
        try {
            const response = await fetch(ruta);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return this.ramdomizeWords(data);
        } catch (error) {
            console.error("Error fetching words:", error);
            return [];
        }
    }


    ramdomizeWords(words) {
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

    startTimer() {
        this.timerId = setInterval(() => {
            this.timeRemaining--;
            this.timerElement.textContent = this.timeRemaining;
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        if (this.gameEnded) {
            return;
        }

        clearInterval(this.timerId);
        this.gameEnded = true;
        this.timerElement.textContent = "Tiempo!";
        document.querySelectorAll(".cursor").forEach(cursor => cursor.classList.remove('cursor'));
        console.log("Game ended");
        this.results();
    }

    handleTyping(e) {
        const activeWord = document.querySelector('.wordActive');
        const letters = activeWord.querySelectorAll('.letter');

        if (this.gameEnded) {
            return;
        }

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
            if (this.charIndex > 0) {
                this.moveToNextWord();
                
            }
        } else if (e.key.length === 1 && /[\p{L}0-9]/u.test(e.key)) {

            if (!this.timerStarted) {
                this.startTimer();
                this.timerStarted = true;
            }

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

    moveToNextWord() {
        const words = document.querySelectorAll('.word');
        const currentWordElement = words[this.currentWordIndex];

        if (this.isCorrectWord(words[this.currentWordIndex])) {
            currentWordElement.classList.add('wordCorrect');
        }

        const extraCursor = document.querySelector('.extra-cursor');
        if (extraCursor) extraCursor.remove();

        if (this.currentWordIndex < this.words.length - 1) {
            words[this.currentWordIndex].classList.remove('wordActive');
            this.currentWordIndex++;
            this.charIndex = 0;
            words[this.currentWordIndex].classList.add('wordActive');
            this.updateCursor();
            this.handleScroll('next');
        }
    }

    moveToPreviousWord() {
        const words = document.querySelectorAll('.word');

        if (this.currentWordIndex === 0) {
            return;
        }

        const previousWordElement = words[this.currentWordIndex - 1];

        if (previousWordElement.classList.contains('wordCorrect')) {
            return;
        }

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

    results () {
        const wpm = (this.correctChars / 5) / (this.duration / 60);
        const cpm = this.correctChars / (this.duration / 60);
        const accuracy = ((this.correctChars / this.totalChars) * 100).toFixed(2);
    
        console.log(`WPM: ${wpm.toFixed(2)}`);
        console.log(`CPM: ${cpm.toFixed(2)}`);
        console.log(`Accuracy: ${accuracy}%`);
    }

    async restartGame() {
        console.log("Reiniciando el juego...");

        clearInterval(this.timerId);

        this.timeRemaining = this.duration;
        this.timerStarted = false;
        this.gameEnded = true;

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
}

const game = new Game(120);

game.init().then(() => {
    document.addEventListener('keydown', (e) => {
        game.handleTyping(e);
    });
});

const restartButton = document.getElementById('restartButton');

restartButton.addEventListener('click', () => {
    game.restartGame();

    restartButton.blur(); 
});