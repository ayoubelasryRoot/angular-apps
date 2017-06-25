import * as Constant from '../StaticValues/constant';

interface WordData {
    x: number;
    y: number;
    points: number[];
    direction: string;
}

export class ScoreCalculator {

    matrixScore: number[][] = [];
    wordData: WordData = { x: 0, y: 0, points: [], direction: 'h' };
    wordScore = 0;
    factor = 1;

    constructor() {
        this.matrixScore = Constant.BOARD;
    }

    setWordData(x: number, y: number, points: number[], direction: string) {
        this.wordData.x = x;
        this.wordData.y = y;
        this.wordData.points = points;
        this.wordData.direction = direction;
    }

    getScoreWord(): number {
        let sizeWord = this.wordData.points.length;
        this.wordScore = 0;
        this.factor = 1;

        if (this.wordData.direction === 'h') {
            this.calculateHoriDirection(sizeWord);
        } else {
            this.calculateVertDirection(sizeWord);
        }
        return this.wordScore * this.factor;
    }

    calculateHoriDirection(sizeWord: number) {
        for (let i = 0; i < sizeWord; i++) {
            let scoreLetter = this.matrixScore[this.wordData.x][i + this.wordData.y];
            this.letterResult(scoreLetter, i);
        }
    }
    calculateVertDirection(sizeWord: number) {
        for (let i = 0; i < sizeWord; i++) {
            let scoreLetter = this.matrixScore[i + this.wordData.x][this.wordData.y];
            this.letterResult(scoreLetter, i);
        }
    }

    letterResult(scoreLetter: number, index: number) {
        switch (scoreLetter) {
            case Constant.BLANK:
                this.wordScore += this.wordData.points[index];
                break;
            case Constant.X2LETTER:
                this.wordScore += (this.wordData.points[index] * 2);
                break;
            case Constant.X3LETTER:
                this.wordScore += (this.wordData.points[index] * 3);
                break;
            case Constant.X2WORD: case Constant.STAR:
                this.wordScore += this.wordData.points[index];
                this.factor = this.factor * 2;
                break;
            case Constant.X3WORD:
                this.wordScore += this.wordData.points[index];
                this.factor = this.factor * 3;
                break;
            default:
                break;
        }
    }
}
