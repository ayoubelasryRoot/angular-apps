/*
 *
 * MInterface.ts - Configures MongoDB and interacts with it for various tasks
 * Will query Interface to generate new sudokus and store them in MongoDB
 * Will query MongoDB to receive sudokus and return appropriate one to client
 * Will post score and provide will generate a log with every interaction.
 * Will return leaderboard
 * Will check username uniqueness and add to DB
 *
*/

import * as mongoose from 'mongoose';
import * as moment from 'moment';
import * as promise from 'es6-promise';
(mongoose as any).Promise = promise; //Using es6-promise with Mongoose
import { Interface } from '../Logique_Sudoku/Interface';


const DELAY = 5; //5 secondes de delais avant de generation
const MAXSUDOKU = 3;
const MAXSCORES = 3;
const MAXJOURNALENTRIES = 100;
const DATEFORMAT = 'YYYY-MM-DD HH:mm:ss';
const DBURL = "mongodb://team11:team11@ds131729.mlab.com:31729/sudoku_tempo";

//"mongodb://INF2990-11:py77cH70@parapluie.lerb.polymtl.ca:27017/INF2990-11-db";
//La BD de poly ne fonctionne pas.

export class DatabaseProxy {

    private sudokuSchema = new mongoose.Schema({
        matrix: [[Number]], //Contains the matrix itself
        date: String, //Contains the date at which it was generated in String form
        difficulty: Number
    });
    private scoreschema = new mongoose.Schema({
        name: String, //Contains the name of the player
        difficulty: Number, //0 or 1 depending on difficulty
        time: String //Score of the player (Time)
    });
    private journalSchema = new mongoose.Schema({
        date: String,
        types: String,
        description: String
    });
    private usernameSchema = new mongoose.Schema({
        username: String
    });

    private sudokus: any;
    private scores: any;
    private journalEntries: any;
    private usernames: any;

    private sudokuEasyGen: Interface;
    private sudokuHardGen: Interface;

    private leaderboard = { easy: [Object], hard: [Object] };
    private sudokuCount = { easy: Number, hard: Number };

    constructor() {
        console.log("Connecting to database...");
        mongoose.connect(DBURL, (err) => {
            if (err) { console.log(err); }
        })
            .then(() => {
                console.log("Initializing database models...");
                this.sudokus = mongoose.model('sudoku', this.sudokuSchema);
                this.scores = mongoose.model('sudoku_score', this.scoreschema);
                this.journalEntries = mongoose.model('sudoku_journal', this.journalSchema);
                this.usernames = mongoose.model('sudoku_username', this.usernameSchema);
                this.initializeDB();
            });

    }
    private initializeDB() {
        //Deletes all left-over sudokus and generates 3 new ones for each difficulty
        console.log("Initializing database content...");
        this.sudokus.remove().exec()
            .then(() => {
                for (let i = 0; i < MAXSUDOKU; i++) {
                    this.generateEasySudokuForDB(0);
                    this.generateHardSudokuForDB(0);
                }
            });
        //If scores DB is empty, populate with dummy scores
        this.scores.find({}).exec()
            .then((resp: JSON[]) => {
                if (!resp.length) {
                    let scoreEasy = { name: 'Paulinet', difficulty: '0', time: '999999999' };
                    let scoreHard = { name: 'Paulinet', difficulty: '1', time: '999999999' };
                    for (let i = 0; i < 3; i++) {
                        this.addNewScoreToDB(scoreEasy);
                        this.addNewScoreToDB(scoreHard);
                    }
                }
            });
        console.log("Database ready!");
    }
    private generateNewSudokus(level: number) {
        if (level === 0) {
            this.addNewJournalEntry("génération", "facile");
            this.sudokuEasyGen = new Interface(0);
        }
        else if (level === 1) {
            this.addNewJournalEntry("génération", "difficile");
            this.sudokuHardGen = new Interface(1);
        }
    }
    private generateHardSudokuForDB(delaySeconds: number) {
        let p = new Promise<number[][]>((resolve, reject) => {
            setTimeout((matrix: number[][]) => {
                this.generateNewSudokus(1);
                matrix = this.sudokuHardGen.get_matrixPuzzle();
                resolve(matrix);
            }, delaySeconds * 1000);
        });
        p.then((matrix) => {
            this.sudokus.create({
                matrix: matrix,
                date: moment().format(DATEFORMAT),
                difficulty: 1
            });
        });
    }
    private getSudokuEasyFromDB(): Promise<Object> {
        return this.sudokus.findOne({ difficulty: '0' }).exec();
    }
    private getSudokuHardFromDB(): Promise<Object> {
        return this.sudokus.findOne({ difficulty: '1' }).exec();
    }
    private generateEasySudokuForDB(delaySeconds: number) {
        let p = new Promise<number[][]>((resolve, reject) => {
            setTimeout((matrix: number[][]) => {
                this.generateNewSudokus(0);
                matrix = this.sudokuEasyGen.get_matrixPuzzle();
                resolve(matrix);
            }, delaySeconds * 1000);
        });
        p.then((matrix) => {
            this.sudokus.create({
                matrix: matrix,
                date: moment().format(DATEFORMAT),
                difficulty: 0
            });
        });
    }
    private loadSudokuEasyToDB() {
        this.sudokus.count({ difficulty: '0' }).exec()
            .then((res: any) => {
                //If DB is empty, generate new Sudokus
                if (res === 0) {
                    this.generateEasySudokuForDB(DELAY);
                }
                else {
                    //If DB is not empty, delete oldest, and then generate new sudoku
                    this.sudokus.findOneAndRemove({ difficulty: '0' }).exec()
                        .then(() => {
                            this.generateEasySudokuForDB(DELAY);
                        });
                }
            });

    }
    private loadSudokuHardToDB() {
        this.sudokus.count({ difficulty: '1' }).exec()
            .then((res: any) => {
                if (res === 0) {
                    this.generateHardSudokuForDB(DELAY);
                }
                else {
                    this.sudokus.findOneAndRemove({ difficulty: '1' }).exec()
                        .then(() => {
                            this.generateHardSudokuForDB(DELAY);
                        });
                }
            });
    }
    getSudokuEasy(): Promise<number[][]> {
        //Appelle la generation avec delais d'un sudoku facile
        this.loadSudokuEasyToDB();
        //Retourne le sudoku facile le plus ancien
        return new Promise<number[][]>((resolve, reject) => {
            resolve(this.getSudokuEasyFromDB());
        });
    }
    getSudokuHard(): Promise<number[][]> {
        //Appelle la generation avec delais d'un sudoku difficile
        this.loadSudokuHardToDB();

        //Retourne le sudoku difficile le plus ancien
        return new Promise<number[][]>((resolve, reject) => {
            resolve(this.getSudokuHardFromDB());
        });
    }
    getSudokuCount() {
        return new Promise((resolve, reject) => {
            this.sudokus.count({ difficulty: '0' }).exec()
                .then((resEasy: any) => {
                    this.sudokuCount.easy = resEasy;
                    this.sudokus.count({ difficulty: '1' }).exec()
                        .then((resHard: any) => {
                            this.sudokuCount.hard = resHard;
                            resolve(this.sudokuCount);
                        });
                });
        });
    }
    getLeaderboard(): Promise<JSON> {
        return new Promise((resolve, reject) => {
            this.scores.find({ difficulty: '0' }).sort({ time: 1 }).limit(MAXSCORES).exec()
                .then((easyResponse: any) => {
                    this.leaderboard.easy = easyResponse;
                    this.scores.find({ difficulty: '1' }).sort({ time: 1 }).limit(MAXSCORES).exec()
                        .then((hardResponse: any) => {
                            this.leaderboard.hard = hardResponse;
                            resolve(this.leaderboard);
                        });
                });
        });
    }
    addNewScoreToDB(score: any): Promise<JSON> {
        return this.scores.create({
            name: score.name, //Contains the name of the player
            difficulty: score.difficulty, //0 or 1 depending on difficulty
            time: score.time //Score of the player (Time)
        })
            .then(() => {
                return { scoreAdded: true };
            });
    }
    addNewJournalEntry(type: String, desc: String) {
        this.journalEntries.create({
            date: moment().format(DATEFORMAT),
            types: type.toUpperCase(),
            description: desc.toUpperCase()
        });
    }
    getLatestJournalEntries(): Promise<JSON> {
        return this.journalEntries.find({}).sort({ 'date': -1 }).limit(MAXJOURNALENTRIES).exec();
    }
    validUsernameCheck(nameEntered: string) {
        return this.usernames.find({ username: nameEntered }).exec();
    }
    addUserToDB(name: any) {
        this.usernames.create({ username: name });
    }
}
