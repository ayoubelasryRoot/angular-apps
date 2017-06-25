/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as indexRoute from './routes';
import { UsernameCheck } from './database/username';
import { DatabaseProxy } from './database/proxy';
import { Game } from './logic/game';

export class Application {

    public app: express.Application;
    public static connections: any[] = [];
    public static database: DatabaseProxy;
    private usernameCheck: UsernameCheck;
    private game: Game;

    /**
     *
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

        Application.database = new DatabaseProxy();

        this.usernameCheck = new UsernameCheck();

        this.game = new Game();

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


        router.post('/api/adduser', (req, res) => {
            this.usernameCheck.validUsernameCheck(req.body.username)
                .then((resp: any) => {
                    if (!resp.length) {
                        this.usernameCheck.addUserInDatabase(req.body.username);
                        res.json({ isLoggedIn: true });
                    } else {
                        res.json({ isLoggedin: false });
                    }
                })
                .catch((e: any) => { console.log(e); });
        });

        //return the specified player with the roomID which he belongs
        router.post('/api/roomID', (req, res) => {
            Application.database.getRoomID(req.body.player)
                .then((resp: any) => {
                    res.json(resp);
                });
        });

        //return all the members of the specified roomID
        router.post('/api/members', (req, res) => {
            Application.database.getRoomMembers(req.body.roomID)
                .then((resp: any) => {
                    res.json(resp);
                });
        });

        //return boolean of word validity
        router.post('/api/word', (req, res) => {
            Application.database.validateWord(req.body.word)
                .then((resp: any) => {
                    res.json(resp);
                });
        });

        //use router middleware
        this.app.use(router);

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

    /*public initSocketHandlers() {
        this.game.initSocketHandlers();
    }*/
}
