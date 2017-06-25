import { Letter } from '../logic/letter';


export class Reserve {

    public nbLetter: number;
    private matrixLetters: string[];
    public letters: Letter[] = [];
    private matrixOccurence: number[];
    public remainingLetters: number;
    public usedLettersPosition: number;

    constructor() {

        this.usedLettersPosition = 102;
        this.nbLetter = 102;

        this.matrixLetters = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g',
            'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u',
            'v', 'w', 'x', 'y', 'z', ' '
        ];

        this.matrixOccurence = [
            9, 2, 2, 3, 15, 2, 2,
            2, 8, 1, 1, 5, 3, 6,
            6, 2, 1, 6, 6, 6, 6,
            2, 1, 1, 1, 1, 2
        ];

        for (let i = 0; i < this.matrixLetters.length; i++) {
            for (let j = 0; j < this.matrixOccurence[i]; j++) {
                this.letters.push(new Letter(this.matrixLetters[i]));
            }
        }

        this.remainingLetters = this.usedLettersPosition;

    }


    randomLetterGenerator(): Letter {
        if (this.usedLettersPosition > 0) {

            let randomLetterId = Math.floor(Math.random() * this.usedLettersPosition);
            this.usedLettersPosition--;
            let letterTemp: Letter = this.letters[this.usedLettersPosition];
            this.letters[this.usedLettersPosition] = this.letters[randomLetterId];
            this.letters[randomLetterId] = letterTemp;

            this.remainingLetters--;
            return this.letters[this.usedLettersPosition];
        }
    }
}
