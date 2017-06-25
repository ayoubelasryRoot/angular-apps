export class SudokuLogiqueFonctions {
    id: string[][] = [];

    constructor() {
        this.initialiser_id();
    }

    get_matrix_id(): string[][] {
        return this.id;
    }

    isValid(row: number, column: number, matrix: number[][], test: boolean): boolean {
        let value: number = matrix[row][column];
        let result = true;

        if (value !== 0) {
            let sectorRow = 3 * (Math.floor(row / 3));
            let sectorCol = 3 * (Math.floor(column / 3));


            result = this.verify_sqrt_region(sectorRow, sectorCol, row, column, matrix, test);
            if (result) {
                result = this.verify_row_col(row, column, matrix, test);
            }
        }

        return result;
    }

    verify_sqrt_region(sectorRow: number, sectorCol: number, row: number,
        column: number, matrix: number[][], test: boolean): boolean {
        let result = true;
        for (let x = sectorRow; x < sectorRow + 3; x++) {
            for (let y = sectorCol; y < sectorCol + 3; y++) {
                if (x !== row || y !== column) {

                    let value: number = matrix[x][y];
                    if (!isNaN(value) && matrix[x][y] === matrix[row][column]) {
                        result = false;
                        if (!test) {
                            document.getElementById(this.id[x][y]).style.color = "#B71C1C";
                        }
                    }
                }
            }
        }
        return result;
    }

    verify_row_col(row: number, column: number, matrix: number[][], test: boolean): boolean {
        let result = true;
        for (let i = 0; i < 9; i++) {
            if (i !== row) {
                if (matrix[i][column] === matrix[row][column]) {
                    if (!test) {
                        document.getElementById(this.id[i][column]).style.color = "#B71C1C";
                    }
                    result = false;
                }
            }

            if (column !== i) {
                if (matrix[row][i] === matrix[row][column]) {
                    if (!test) {
                        document.getElementById(this.id[row][i]).style.color = "#B71C1C";
                    }
                    result = false;
                }
            }
        }
        return result;
    }


    initialiser_id() {
        for (let i = 0; i < 9; i++) {
            let temp: string[] = [];
            for (let j = 0; j < 9; j++) {
                let position: string = "" + i + "" + j;
                temp.push(position);
            }
            this.id.push(temp);
        }
    }
}
