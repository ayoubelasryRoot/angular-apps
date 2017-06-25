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
import * as promise from 'es6-promise';
let jsonfile = require('jsonfile');
(mongoose as any).Promise = promise; //Using es6-promise with Mongoose

const DBURL = "mongodb://team11:team11@ds123410.mlab.com:23410/scrabbledb";

//"mongodb://INF2990-11:py77cH70@parapluie.lerb.polymtl.ca:27017/INF2990-11-db";
//La BD de poly ne fonctionne pas.

export class DatabaseProxy {
    private db: any;
    private playerSchema = new mongoose.Schema({
        username: String,
        roomType: Number,
        roomID: Number,
        turn: Number
    });

    private wordSchema = new mongoose.Schema({
        word: String
    });

    private players: any;
    private dictionary: any;
    private jsonDictionary: string[];

    constructor() {
        this.jsonDictionary = [];
        console.log("Connecting to database...");
        this.db = mongoose.createConnection(DBURL);

        console.log("Initializing database models...");
        this.players = this.db.model('player', this.playerSchema);
        this.dictionary = this.db.model('dictionary', this.wordSchema);
        this.initialize_BD();
    }

    private initialize_BD() {
        console.log("Initializing database content...");
        //Clear all left-over players in game room
        this.players.remove().exec();
    }

    public addGameRoom(roomMembers: string[], roomType: number, roomID: number): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.setPlayersTurn(roomMembers);
            let turnCount = 1;
            roomMembers.forEach(member => {
                this.players.create({
                    username: member,
                    roomType: roomType,
                    roomID: roomID,
                    turn: turnCount
                });
                turnCount++;
            });
            resolve(true);
        });
    }

    //CHANGE LATER USING TILES TO DETERMINE PLAYER'S TURN
    private setPlayersTurn(players: string[]) {
        let draw: { player: string, value: number }[] = [];
        //Each player draw a number
        for (let i = 0; i < players.length; i++) {
            draw.push({ player: players[i], value: Math.floor(Math.random() * 100) });
        }
        //Order of player's turn is determined by descending order
        draw.sort((a, b) => {
            return a.value - b.value;
        });

        players.length = 0;
        for (let i = 0; i < draw.length; i++) {
            players.push(draw[i].player);
        }
    }

    public getRoomMembers(roomID: number): Promise<JSON> {
        return this.players.find({ roomID: roomID }).sort({ 'turn': -1 }).exec();
    }

    public getRoomID(player: string): Promise<JSON> {
        return this.players.findOne({ username: player }).exec();
    }

    public validateWord(word: string): Promise<boolean> {
        let capitalWord: string = word.toUpperCase();
        return new Promise<boolean>((resolve) => {
            if (this.jsonDictionary.length === 0) {
                jsonfile.readFile('./dictionary.json', (err, data) => {
                    console.log(err);
                    this.jsonDictionary = data.dictionary;
                    let found = this.jsonDictionary.find((w) => {
                        return w === capitalWord;
                    });
                    let isPresent = (found !== undefined);
                    resolve(isPresent);
                });
            } else {
                let found = this.jsonDictionary.find((w) => {
                    return w === capitalWord;
                });
                let isPresent = (found !== undefined);
                resolve(isPresent);
            }

        });
    }
}
