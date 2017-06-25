import * as mongoose from 'mongoose';
import * as promise from 'es6-promise';
(mongoose as any).Promise = promise; //Workaround to assign es6-promise to mongoose
const DBURL = "mongodb://team11:team11@ds123410.mlab.com:23410/scrabbledb";

export class UsernameCheck {
    private db: any;
    private usernameSchema = new mongoose.Schema({
        username: String
    });

    private usernames: any;

    constructor() {
        console.log("Connecting to Marc's database...");

        this.db = mongoose.createConnection(DBURL);
        console.log("Initializing database...");
        this.usernames = this.db.model('scrabble_username', this.usernameSchema);
        //this.usernames.remove().exec();
    }

    //fonction qui valide si le nom est deja existant
    validUsernameCheck(nameEntered: string) {
        return this.usernames.find({ username: nameEntered })
            .exec();
    }
    //fonction pour ajouter un utilisateur dans la base de donnees
    addUserInDatabase(name: any) {
        console.log('Adding a New Username');
        this.usernames.create({ username: name });
        console.log('Username ' + name + ' Added');
    }

}
