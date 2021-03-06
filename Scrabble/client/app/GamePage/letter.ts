import { letterValues } from '../StaticValue/constant';

export class Letter {

      private name: string;
      private score: number;

      constructor(name: string) {
            this.name = name;
            if (name === ' ') {
                  this.score = 0;
            }
            else if (name === '?') {
                  this.score = 100;
            }
            else {
                  this.score = letterValues[name.charCodeAt(0) - 97];
            }
      }

      public getScoreLetter(): number {
            return this.score;
      }

      public setScoreLetter(newScore: number) {
            this.score = newScore;
      }

      public getLetter(): string {
            return this.name;
      }

      public equal(letter: Letter) : boolean {
            return this.name === letter.name;
      }
}
