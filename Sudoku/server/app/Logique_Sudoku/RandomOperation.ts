/*
Author : Salah Eddine Kamate
Objet : Génère un tableau d'opérations de taille (threshold) selon le niveau de dificulté
*/

export class RandomOperation {
    private level_: number;
    private operationTable: number[];
    public threshold: number;
    constructor(level: number) {
        this.level_ = level;
        this.operationTable = [];
        this.threshold = this.generateDifficultyThreshold();
    }

    getLevel(): number {
        return this.level_;
    }

    // genenrer un seuil de nombre d'opérations a effectuer selon la difficulté
    generateDifficultyThreshold(): number {
        let nbrOperation: number;

        // limter le nombre d'opérations à 50 si facile
        if (this.getLevel() === 0) {
            nbrOperation = Math.floor(Math.random() * 50);
            return nbrOperation;
        }

        // nombre d'opérations entre 50 et 100 si difficile
        if (this.getLevel() === 1) {
            nbrOperation = Math.floor(Math.random() * 50) + 50;
            return nbrOperation;
        }
        else {
            return null;
        }
    }

    // retourne un tableau d'indentificateur (number) d'opérations à effectuer
    getOperationSudoku(): number[] {

        let randomOperation: number;
        randomOperation = Math.floor(Math.random() * 4);
        let lastOperation: number;
        lastOperation = randomOperation;

        this.operationTable.push(randomOperation);
        if (this.threshold !== 0) {
            for (let i = 0; i < this.threshold; i++) {

                // s'assurer qu'une même opération ne se succède pas
                while (i !== 0 && lastOperation === randomOperation) {
                    randomOperation = Math.floor(Math.random() * 4);
                    if (lastOperation !== randomOperation) {
                        this.operationTable[i] = (randomOperation);
                    }
                }
                if (i !== 0) {
                    randomOperation = Math.floor(Math.random() * 4);
                    this.operationTable.push(Math.floor(randomOperation));
                }
                lastOperation = randomOperation;
            }
        }
        return this.operationTable;
    }
}
