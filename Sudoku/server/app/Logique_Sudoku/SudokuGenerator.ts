/*Ayoub El asry */
export class SudokuGenerator{
    private matrixInitial: number[][] = [
        [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
        [ 4, 5, 6, 7, 8, 9, 1, 2, 3 ],
        [ 7, 8, 9, 1, 2, 3, 4, 5, 6 ],
        [ 2, 3, 4, 5, 6, 7, 8, 9, 1 ],
        [ 5, 6, 7, 8, 9, 1, 2, 3, 4 ],
        [ 8, 9, 1, 2, 3, 4, 5, 6, 7 ],
        [ 3, 4, 5, 6, 7, 8, 9, 1, 2 ],
        [ 6, 7, 8, 9, 1, 2, 3, 4, 5 ],
        [ 9, 1, 2, 3, 4, 5, 6, 7, 8 ]
    ];
    public matrixFinal: number[][] = [];

    private randomValideValue: number[] = [0, 1, 2];

    constructor() {
        this.copy_value_matrix();
    }

    copy_value_matrix(){
        for (let i = 0 ; i < this.matrixInitial.length; i++) {
            this.matrixFinal[i] = this.matrixInitial[i].slice(0);
        }
    }

    generate_sudoku(randomOperation: number[]): number[][] {
        for (let i = 0; i < randomOperation.length; i++) {
            this.function_call_index(randomOperation[i]);
        }
        return this.matrixFinal;
    }

    swap_all_rows(){
        for (let i = 0; i < 9; i = i + 3) {
            //Generer des indices differents pour index1 et index2
            let index1: number = this.generate_random_index_1();
            let index2: number = this.generate_random_index_2();

            this.swap_row(i + index1, i + index2);
            //renitialiser le tableau d'index possible
            this.randomValideValue = [0, 1, 2];
        }
    }

    swap_row(index1: number, index2 : number){
        let row1: number[] = this.matrixFinal[index1].slice(0);
        let row2: number[] = this.matrixFinal[index2].slice(0);

        for (let c = 0; c < 9; c++){
            this.matrixFinal[index1][c] = row2[c];
            this.matrixFinal[index2][c] = row1[c];
        }
    }

    swap_all_columns(){
        for (let i = 0; i < 9; i = i + 3){
            //Generer des indices differents pour index1 et index2
            let index1: number = this.generate_random_index_1();
            let index2: number = this.generate_random_index_2();

            this.swap_column(index1 + i, index2 + i);

            this.randomValideValue = [0, 1, 2];
        }
    }

     swap_column(index1: number, index2 : number){
        for (let y = 0; y < 9; y++){
            let tempValue = this.matrixFinal[y][index1];
            this.matrixFinal[y][index1] = this.matrixFinal[y][index2];
            this.matrixFinal[y][index2] = tempValue;
        }
    }

    inverse_matrix_horizontal(){
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 4; y++){
                this.inverse_value(x, y);
            }
        }
    }
    inverse_matrix_vertical(){
        for (let x = 0; x < 4; x++) {
            this.swap_row(x, 8 - x);
        }
    }

    inverse_matrix_diagonal_descendant(){
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < x; y++){
                this.inverse_value_diagonal_operation(x, y, 0);
            }
        }
    }

    inverse_matrix_diagonal_ascendant(){
        for (let x = 0; x < 9; x++){
            for (let y = 0; y < (9 - x); y++){
                this.inverse_value_diagonal_operation(x, y, 8);
            }
        }
    }

    inverse_value_diagonal_operation(x: number, y: number, ref: number){
        let temp = this.matrixFinal[x][y];
        this.matrixFinal[x][y] = this.matrixFinal[Math.abs(ref - y)][Math.abs(ref - x)];
        this.matrixFinal[Math.abs(ref - y)][Math.abs(ref - x)] = temp;
    }

    get matrix_initial(): number[][] {
        return this.matrixInitial;
    }

    get matrix_final(): number[][] {
        return this.matrixFinal;
    }

    function_call_index(valueIndex: number) {
        switch (valueIndex){
            case 0: {
                this.swap_all_rows();
            }
            break;

            case 1: {
                this.swap_all_columns();
            }
            break;

            case 2: {
                this.inverse_matrix_horizontal();
            }
            break;

            case 3: {
                this.inverse_matrix_vertical();
            }
            break;

            case 4: {
                this.inverse_matrix_diagonal_descendant();
            }
            break;

            case 5: {
                this.inverse_matrix_diagonal_ascendant();
            }
            break;

            default : {
                console.log("index non valide");
                break;
            }
        }
    }

    generate_random_index_1() : number {
        let indice: number = Math.floor(Math.random() * (this.randomValideValue.length));
        let index = this.randomValideValue.indexOf(indice, 0);
        this.randomValideValue.splice(index, 1); // delete l'element trouve pour piger un autre la prochaine fois
        return index;
    }

    generate_random_index_2() : number {
        return this.randomValideValue[Math.floor(Math.random() * (this.randomValideValue.length))];
    }

    inverse_value(x : number, y : number) {
        let tempValue = this.matrixFinal[x][y];
        this.matrixFinal[x][y] = this.matrixFinal[x][8 - y];
        this.matrixFinal[x][8 - y] = tempValue;
    }
}
