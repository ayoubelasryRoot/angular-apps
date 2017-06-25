import * as mongoose from 'mongoose';
import * as promise from 'es6-promise';
(mongoose as any).Promise = promise;


const DBURL = "mongodb://team11:team11@ds131729.mlab.com:31729/sudoku_tempo";
const MAXSCORES = 3;


export class DatabaseProxy {
    private usernameSchema = new mongoose.Schema({
        username: String
    });
    private scoreschema = new mongoose.Schema({
        name: String, //Contains the name of the player
        difficulty: Number, //0 or 1 depending on difficulty
        score: Number //Score of the player (Time)
    });
    private usernames: any;
    private scores: any;
    private leaderboard = { easy: [Object], hard: [Object] };


    constructor() {
        console.log("Connecting to database...");
        mongoose.connect(DBURL, (err) => {
            if (err) { console.log(err); }
        })
            .then(() => {
                console.log("Initializing database...");
                this.usernames = mongoose.model('curling_username', this.usernameSchema);
                this.scores = mongoose.model('curling_score', this.scoreschema);
                this.initializeDB();
            });
    }

    private initializeDB() {
        console.log("Initializing database content...");
        this.scores.find({}).exec()
            .then((resp: JSON[]) => {
                if (!resp.length) {
                    let scoreEasy = { name: 'Paulinet', difficulty: '0', score: '1' };
                    let scoreHard = { name: 'Paulinet', difficulty: '1', score: '1' };
                    for (let i = 0; i < 3; i++) {
                        this.addNewScoreToDB(scoreEasy);
                        this.addNewScoreToDB(scoreHard);
                    }
                }
                console.log("Database ready");
            });
    }

    addNewScoreToDB(score: any): Promise<JSON> {
        return this.scores.create({
            name: score.name, //Contains the name of the player
            difficulty: score.difficulty, //0 or 1 depending on difficulty
            score: score.score //Score of the player (Time)
        })
            .then(() => {
                return { scoreAdded: true };
            });
    }

    getLeaderboard(): Promise<JSON> {
        return new Promise((resolve, reject) => {
            this.scores.find({ difficulty: '0' }).sort({ score: -1 }).limit(MAXSCORES).exec()
                .then((easyResponse: any) => {
                    this.leaderboard.easy = easyResponse;
                    this.scores.find({ difficulty: '1' }).sort({ score: -1 }).limit(MAXSCORES).exec()
                        .then((hardResponse: any) => {
                            this.leaderboard.hard = hardResponse;
                            resolve(this.leaderboard);
                        });
                });
        });
    }

    //fonction qui valide si le nom est deja existant
    validUsernameCheck(nameEntered: string) {
        return this.usernames.find({ username: nameEntered })
            .exec();
    }
    //fonction pour ajouter un utilisateur dans la base de donnees
    addUserToDatabase(name: any) {
        console.log('Adding a New Username');
        this.usernames.create({ username: name });
        console.log('Username ' + name + ' Added');
    }

}
