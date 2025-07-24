console.log("Script loaded");

class Game {
    constructor(text) {
        this.typingContainer = document.getElementById("typingContainer");
        this.text = text;
        this.words = this.splitWords(text);
        this.currentWordIndex = 0;
        this.charIndex = 0;
        this.setEnvironment();
    }

    splitWords(cadena) {
        return cadena.split(' ');
    }

    setEnvironment() {
        this.typingContainer.innerHTML = '';

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
            this.typingContainer.appendChild(wordDiv);
        });
        this.updateCursor();
    }

    handleTyping(e) {
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
            if (this.charIndex > 0) {
                this.moveToNextWord();
                
            }
        } else if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
            if (this.charIndex < letters.length) {
                const currentLetter = letters[this.charIndex];
                if (e.key === currentLetter.textContent) {
                    currentLetter.classList.add('correct');
                } else {
                    currentLetter.classList.add('incorrect');
                }
                this.charIndex++;
            } else {
                const extraLetter = document.createElement('span');
                extraLetter.className = 'letter incorrect extra';
                extraLetter.textContent = e.key;
                activeWord.appendChild(extraLetter);
                this.charIndex++;
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
        const letters = wordElement.querySelectorAll('.letter');
        const origialWord = this.words[this.currentWordIndex];

        if (wordElement.querySelector('extra')){
            return false;
        }

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
}

const txt = "ohayo sekai good morning world lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua";
const game = new Game(txt);

document.addEventListener('keydown', (e) => {
    game.handleTyping(e);
});

console.log("Game initialized with text:", txt);