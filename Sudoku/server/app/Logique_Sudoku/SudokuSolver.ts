/*
Author : Ayoub El Asry
A faire : replacer le long code par des function et blinde rle typage
*/

export class SudokuSolver{

    private matrixSolution: number[][];
    public matrixCopie: number[][];
    private matrixCopie2: number[][];
    private totalNumberEmptyCase: number;
    private possiblePositions: number[];

    constructor(matrixSolution: number[][], level : number){
        this.matrixSolution = [];
        this.matrixCopie = [];
        if (level === 0) { this.totalNumberEmptyCase = 53; }
        else if (level === 1) { this.totalNumberEmptyCase = 56; }
        this.possiblePositions = [];
        this.copy_value_array(this.matrixSolution, matrixSolution);
        this.generate_all_positions();
    }

    copy_value_array(matrix1: number[][], matrix2: number[][]){
        for (let i = 0; i < 9; i++){
            let temp : number[] = [];
            for (let j = 0; j < 9; j++){
                temp.push(matrix2[i][j]);
            }
            matrix1.push(temp);
        }
    }
    copy_value_index(matrix1: number[][], matrix2: number[][]){
        for (let i = 0; i < 9; i++ ){
            for (let j = 0; j < 9; j++){
                matrix1[i][j] = matrix2[i][j];
            }
        }
    }

    generate_all_positions() {
        for (let i = 0; i < 9; i++){
            for (let j = 0; j < 9; j++){
                this.possiblePositions.push(i * 10 + j);
            }
        }
    }

    generate_puzzle() : number[][] {
        for (let opp = 0; opp < this.totalNumberEmptyCase; opp++) {

            let randomPosition: number = this.generate_random_position();
            let xToDelete: number = Math.floor(randomPosition / 10);
            let yToDelete : number = randomPosition % 10;

            let tempValue: number = this.matrixSolution[xToDelete][yToDelete];
            this.matrixSolution[xToDelete][yToDelete] = 0;
            this.copy_value_array(this.matrixCopie, this.matrixSolution);

            if (!this.solve(this.matrixCopie)){
                this.matrixSolution[xToDelete][yToDelete] = tempValue;
                opp--;
            }

        }

        return this.matrixSolution;
    }

    generate_random_position(): number{
        let max: number = this.possiblePositions.length;
        let position: number = Math.floor(Math.random() * max);
        let result = this.possiblePositions[position];
        this.possiblePositions.splice(position, 1);
        return result;
    }

    isValid(matrixCopie: number[][], num: number, row: number, column: number) {

        let sectorRow = 3 * (Math.floor(row / 3));
        let sectorCol = 3 * (Math.floor(column / 3));

        for (let x = sectorRow; x < sectorRow + 3; x++) {
            for (let y = sectorCol; y < sectorCol + 3; y++) {
                if (x !== row || y !== column) {
                    let value : number = matrixCopie[x][y];
                    if (!isNaN(value) && matrixCopie[x][y] === num) {
                        return false;
                    }
                }
            }
        }

        for (let i = 0; i < 9; i++) {
            if (i !== row && matrixCopie[i][column] === num) { return false; }
            if (column !== i && matrixCopie[row][i] === num) { return false; }
        }

        return true;
    }

    solve(matrixCopie : number[][]): Boolean {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (matrixCopie[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(this.matrixCopie, num, i, j)) {
                            matrixCopie[i][j] = num;
                            if (this.solve(matrixCopie)) { return true; }
                            else { matrixCopie[i][j] = 0; }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    solve_complete(matrixCopie: number[][]) : number[][]{
        this.matrixCopie2 = [];
        this.copy_value_array(this.matrixCopie2, matrixCopie);
        let sol : Boolean = this.solve_test(this.matrixCopie2);
        if (sol) { return this.matrixCopie2; }
        else { return null; }
    }

    solve_test(matrixCopie : number[][]): Boolean {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (matrixCopie[i][j] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(this.matrixCopie2, num, i, j)) {
                            matrixCopie[i][j] = num;
                            if (this.solve_test(matrixCopie)) { return true; }
                            else { matrixCopie[i][j] = 0; }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    show_matrix(matrix : number[][]){
        for (let x = 0; x < 9; x++){
            let row = "";
            for (let y = 0; y < 9; y++){
                row += matrix[x][y] + " ";
            }
            console.log(row);
        }
    }

    get_number_empty_case(){
        return this.totalNumberEmptyCase;
    }
}
