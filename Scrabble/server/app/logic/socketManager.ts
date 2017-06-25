import * as http from 'http';
import * as SocketIo from 'socket.io';
import { Game } from './game';
import { Letter } from './letter';
import * as Constant from '../StaticValues/constant';

export class SocketManager {

    private static _instance: SocketManager = new SocketManager();
    private socketio: any;
    private game: Game;

    public static getInstance(): SocketManager {
        return SocketManager._instance;
    }

    constructor() {
        if (SocketManager._instance) {
            throw new Error("Error: Instantiation failed: Use SocketManager.getInstance() instead of new.");
        }
        SocketManager._instance = this;
    }

    public initSocket(server: http.Server) {
        this.socketio = SocketIo(server);
        this.initSocketHandlers();
        this.game = new Game();
    }

    public joinQueueRoom(roomType: number, socket: SocketIO.Socket) {
        socket.join(roomType + '');
    }

    public leaveQueueRoom(roomType: number, socket: SocketIO.Socket) {
        socket.leave(roomType + '');
    }

    public updateQueue(roomType: number, queue: { members: string[], roomSize: number, ID: number }) {
        this.socketio.in(roomType).emit('update_queue', queue.members.length);
    }

    public switchRoom(roomType: number, newRoomID: number) {
        let clientsInRoom = this.socketio.sockets.adapter.rooms[roomType];

        for (let socket in clientsInRoom.sockets) {
            //Application.socketio.sockets.in(roomType).join(this.roomIDCount);
            this.socketio.sockets.connected[socket].join(newRoomID);
            this.socketio.sockets.connected[socket].leave(roomType);
        }
    }

    public createRoom(roomID: number, members: string[]) {
        this.socketio.in(roomID).emit('create_room', { roomPlayers: members, roomID: roomID });
    }

    public assignRoomID(roomID: number) {
        this.socketio.in(roomID).emit('roomID', { roomID: roomID });
    }

    public initSocketHandlers() {

        //this.onConnectionSub = this.socketManager.onConnection().subscribe((socket: any) => {
        this.socketio.on('connection', (socket: SocketIO.Socket) => {

            socket.on('disconnect', (data: any) => {
                //Application.connections.splice(Application.connections.indexOf(socket), 1);
            });

            socket.on('change_turn', (data: any) => {
                this.game.changeTurn(data.roomID, data.playersSize);
            });

            socket.on('player_left', (data: any) => {
                for (let i = 0; i < data['letters'].length; i++) {
                    data['letters'][i] = new Letter(data['letters'][i].name);
                }

                this.socketio.in(data.roomID).emit('delete_player', { player: data.player });
                this.game.playerLeft(data.roomID, data.letters);
            });

            socket.on('initialised', (data: any) => {
                this.game.changeTime(data.roomID, data.playersSize);
            });

            socket.on('send_message', (data: any) => {
                this.socketio.in(data.roomID).emit('new_message',
                    { username: data.username, message: data.text });
            });

            socket.on('request_letter', (data: any) => {
                this.game.requestLetter(data.roomID, socket);
            });

            socket.on('need letters', (data: any) => {
                this.game.sendLetter(socket, data.size, data.roomID);
            });


            socket.on('request_letters_change', (data: any) => {
                this.game.requestLetterChange(data.roomID, data.letter, socket);
            });

            this.manageGameSockets(socket);
            this.manageQueueSockets(socket);

        });
    }

    private manageQueueSockets(socket: SocketIO.Socket) {
        socket.on('join_queue', (data: any) => {
            this.joinQueueRoom(data.roomType, socket);
            this.game.joinQueue(data.roomType, data.username);
        });

        socket.on('leave_queue', (data: any) => {
            this.game.leaveQueue(data.roomType, data.username);
            this.leaveQueueRoom(data.roomType, socket);
        });
    }

    private manageGameSockets(socket: SocketIO.Socket) {
        socket.on('init_game_data', (data: any) => {
            this.game.initGameData(data.roomID);
        });

        socket.on('send_end_game_score', (data: any) => {
            this.game.sendEndGameScore(data.roomID, data.activePlayer, data.senderPlayer, data.score);
        });

        socket.on('player_left_end_game', (data: any) => {
            this.socketio.in(data.roomID).emit('update_info_end_game', { playerLeft: data.playerLeft });
        });

        socket.on('word_validation', (data: any) => {
            let rack: Letter[] = [];
            //when parsing the data object, the data lost all its function, so it has to be re-created
            data.rack.forEach((letter) => {
                rack.push(new Letter(letter.name));
            });
            this.game.validateWord(
                data.word, data.row, data.col, data.direction, data.player, rack, data.roomID, socket);
        });
    }

    public updateReserve(roomID: number, remainingLetters: number) {
        this.socketio.in(roomID).emit('update_reserve', remainingLetters);
    }

    public sendLetterToClient(socket: any, letter: Letter) {
        socket.emit('send_letter', { letter: letter });
    }

    public changeLetterForClient(socket: any, letterToSearch: string, newLetter: Letter) {
        socket.emit('change_letters', {
            letterToChange: letterToSearch,
            newLetter: newLetter
        });
    }

    public updateScore(roomID: number, activePlayerName: string, score: number) {
        this.socketio.in(roomID).emit('update_score', { player: activePlayerName, score: score });
    }

    public announceWinner(roomID: number, winnerPlayerName: string) {
        this.socketio.in(roomID).emit('announce_winner', { winner: winnerPlayerName });
    }

    public placeWordInGrid(roomID: number, lettersUsed: Constant.LetterPosition[]) {
        //update grid with new word to all client
        this.socketio.in(roomID).emit('place_word_in_grid', { lettersToPlace: lettersUsed });
    }

    public removeRackLettersOfClient(socket: any, lettersUsed: string[]) {
        socket.emit('remove_rack_letters', { lettersToPlace: lettersUsed });
    }

    public retrieveWordInGrid(roomID: number, lettersUsed: Constant.LetterPosition[]) {
        //update grid with removed word to all client
        this.socketio.in(roomID).emit('retrieve_word_in_grid', { lettersToRemove: lettersUsed });
    }

    public addRackLettersOfClient(socket: any, lettersUsed: Constant.LetterPosition[]) {
        socket.emit('add_rack_letters', { lettersToRemove: lettersUsed });
    }

    public passTurn(socket) {
        socket.emit('pass_turn');
    }

    public displayError(socket, errorCode: number) {
        socket.emit('display_error', { errorCode: errorCode });
    }

    public updateTime(roomID: number, newMinutes, newSeconds) {
        this.socketio.in(roomID).emit('new_time', {
            newMinutes: newMinutes,
            newSeconds: newSeconds
        });
    }

    public updatePriority(roomID: number, priority: number) {
        this.socketio.in(roomID).emit('new_priority',
            { newPlayer: priority });
    }

    public endGame(socket: SocketIO.Socket, roomID: number, player: string) {
        socket.broadcast.to(roomID + '').emit('end_game', player);
    }

}
