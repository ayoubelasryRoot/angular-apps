/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 * Authors : Salim Eid & Marc El Khoury
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as indexRoute from './routes';
import { DatabaseProxy } from './database/proxy';

export class Application {

    public app: express.Application;
    private database: DatabaseProxy;


    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
     */
    public static bootstrap(): Application {
        return new Application();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // Application instantiation
        this.app = express();

        //configure this.application
        this.config();

        //configure routes
        this.routes();

        //initialize database
        this.database = new DatabaseProxy();
    }

    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    private config() {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors());
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes() {
        let router: express.Router;
        router = express.Router();

        //create routes
        const index: indexRoute.Index = new indexRoute.Index();

        //home page
        router.get('/', index.index.bind(index.index));

        //use router middleware
        this.app.use(router);
        this.app.use(cors());

        //POST username
        this.app.post('/api/adduser', (req, res) => {
            this.database.validUsernameCheck(req.body.username)
                .then((resp: any) => {
                    if (!resp.length) {
                        this.database.addUserToDB(req.body.username);
                        res.json({ isLoggedIn: true });
                    } else {
                        res.json({ isLoggedIn: false });
                    }
                })
                .catch((e: any) => { console.log(e); });
        });

        //GET sudoku easy
        this.app.get("/api/sudokueasy", (req, res) => {
            this.database.addNewJournalEntry("demande", req.connection.remoteAddress);
            this.database.getSudokuEasy()
                .then((response: any) => {
                    if (!response) {
                        throw new Error("Nothing found");
                    }
                    res.json(response.matrix);
                })
                .catch((err: any) => {
                    console.log(err + " Try again.");
                    res.json(null);
                });
        });

        //GET sudoku hard
        this.app.get("/api/sudokuhard", (req, res) => {
            this.database.addNewJournalEntry("demande", req.connection.remoteAddress);
            this.database.getSudokuHard()
                .then((response: any) => {
                    if (!response) {
                        throw new Error("Nothing found");
                    }
                    res.json(response.matrix);
                })
                .catch((err: any) => {
                    console.log(err + " Try again.");
                    res.json(null);
                });
        });


        //GET leaderboard
        this.app.get("/api/leaderboard", (req, res) => {
            this.database.getLeaderboard()
                .then((response: JSON) => {
                    res.json(response);
                });
        });

        //GET number of sudokus in DB
        this.app.get("/api/sudokucount", (req, res) => {
            this.database.getSudokuCount()
                .then((response: JSON) => {
                    res.json(response);
                });
        });

        //GET journal entries
        this.app.get("/api/journal", (req, res) => {
            this.database.getLatestJournalEntries()
                .then((response: JSON) => {
                    res.json(response);
                });
        });

        //POST Sudoku Score
        this.app.post('/api/userscore', (req, res) => {
            this.database.addNewScoreToDB(req.body)
                .then((response: any) => {
                    res.json(response);
                });
        });

        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            let err = new Error('Not Found');
            next(err);
        });


        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
