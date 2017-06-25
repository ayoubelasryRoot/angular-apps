/*
 * Alexandre Hua
 */

import { expect } from 'chai';
import { Game } from './game';
import { Reserve } from '../Reserve/reserve';
import { SocketManager } from './socketManager';

function mockSocketManager(socketManager: SocketManager) {
    socketManager['updateQueue'] = () => { return; }
    socketManager['assignRoomID'] = () => { return; }
    socketManager['createRoom'] = () => { return; }
    socketManager['switchRoom'] = () => { return; }
    socketManager['sendLetterToClient'] = () => { return; }
    socketManager['updateReserve'] = () => { return; }
}

function mockGame(game: Game) {
    game['createRoom'] = (members: string[], roomType: number, roomID: number) => {
        return new Promise<boolean>((resolve) => {
            game.resetQueue(roomType);
        });
    }
}

describe("Queue", () => {
    let socketManager: SocketManager;
    let subject: Game;
    let member1: string;
    let member2: string;
    let roomType: number;

    beforeEach(() => {
        socketManager = SocketManager.getInstance();
        mockSocketManager(socketManager);
        subject = new Game();
        mockGame(subject);
        member1 = 'Bob';
        member2 = 'Cop';
        roomType = 3;
    });

    it("should add new member to queue", () => {
        let expectedArray: string[] = ['Bob'];
        let queue: { members: string[], roomSize: number, ID: number };

        subject.joinQueue(roomType, member1);
        queue = subject.getQueueRoom(roomType);

        expect(queue.members).to.have.members(expectedArray);
    });

    it("should have two members in queue", () => {
        let expectedArray: string[] = ['Bob', 'Cop'];
        let queue: { members: string[], roomSize: number, ID: number };

        subject.joinQueue(roomType, member1);
        subject.joinQueue(roomType, member2);
        queue = subject.getQueueRoom(roomType);

        expect(queue.members).to.have.members(expectedArray);
    });

    it("should not add new member to other type of queue", () => {
        let expectedArray: string[] = ['Bob'];
        let queueRoom3: { members: string[], roomSize: number, ID: number };
        let queueRoom4: { members: string[], roomSize: number, ID: number };

        subject.joinQueue(roomType, member1);
        queueRoom3 = subject.getQueueRoom(2);
        queueRoom4 = subject.getQueueRoom(4);

        expect(queueRoom3.members).to.not.have.members(expectedArray);
        expect(queueRoom4.members).to.not.have.members(expectedArray);
    });

    it("should add 1 member in each queue", () => {
        let expectedArray: string[] = ['Bob'];
        let queueRoom2: { members: string[], roomSize: number, ID: number };
        let queueRoom3: { members: string[], roomSize: number, ID: number };
        let queueRoom4: { members: string[], roomSize: number, ID: number };

        subject.joinQueue(2, member1);
        subject.joinQueue(3, member1);
        subject.joinQueue(4, member1);
        queueRoom2 = subject.getQueueRoom(2);
        queueRoom3 = subject.getQueueRoom(3);
        queueRoom4 = subject.getQueueRoom(4);

        expect(queueRoom2.members).to.have.members(expectedArray);
        expect(queueRoom3.members).to.have.members(expectedArray);
        expect(queueRoom4.members).to.have.members(expectedArray);
    });

    it("should reset queue when full", () => {
        let expectedArray: string[] = [];
        let queue: { members: string[], roomSize: number, ID: number };

        subject.joinQueue(roomType, member1);
        subject.joinQueue(roomType, member2);
        subject.joinQueue(roomType, member2);
        queue = subject.getQueueRoom(roomType);

        expect(queue.members).to.have.members(expectedArray);
    });

    it("should remove member from queue when leaving queue", () => {
        let expectedArray: string[] = [];
        let queue: { members: string[], roomSize: number, ID: number };

        subject.joinQueue(roomType, member1);
        subject.leaveQueue(roomType, member1);
        queue = subject.getQueueRoom(roomType);

        expect(queue.members).to.have.members(expectedArray);
    });
});

describe("Game Room", () => {
    let socketManager: SocketManager;
    let subject: Game;
    let roomType: number;
    let member1: string;
    let member2: string;
    let roomID: number;

    beforeEach(() => {
        socketManager = SocketManager.getInstance();
        mockSocketManager(socketManager);
        subject = new Game();
        mockGame(subject);
        roomType = 2;
        roomID = subject.getCurrentRoomID();
        member1 = 'Bob';
    });

    it("should have one game room created", () => {
        let gameRoomPlayers: { name: string, score: number }[];

        subject.joinQueue(roomType, member1);
        subject.joinQueue(roomType, member1);

        gameRoomPlayers = subject.getRoomPlayers(roomID);

        expect(gameRoomPlayers).to.not.be.null;
    });

    it("should have two game room created", () => {
        let gameRoomPlayers1: { name: string, score: number }[];
        let gameRoomPlayers2: { name: string, score: number }[];

        subject.joinQueue(roomType, member1);
        subject.joinQueue(roomType, member1);
        gameRoomPlayers1 = subject.getRoomPlayers(roomID);

        roomID = subject.getCurrentRoomID();

        subject.joinQueue(roomType, member2);
        subject.joinQueue(roomType, member2);
        gameRoomPlayers2 = subject.getRoomPlayers(roomID);

        expect(gameRoomPlayers1).to.not.be.null;
        expect(gameRoomPlayers2).to.not.be.null;
    });
});

describe("End of game", () => {
    let socketManager: SocketManager;
    let subject: Game;
    let roomType: number;
    let member1: string;
    let member2: string;
    let roomID: number;

    beforeEach(() => {
        socketManager = SocketManager.getInstance();
        mockSocketManager(socketManager);
        subject = new Game();
        mockGame(subject);
        roomType = 2;
        roomID = subject.getCurrentRoomID();
        member1 = 'Bob';
    });

    it("should detect end of game when reserve is empty", () => {
        subject.createRoomData();
        let reserve: Reserve = subject.getRoomReserve(roomID);
        for (let i = 0; i < 102; i++) {
            reserve.randomLetterGenerator();        //empty the reserve
        }

        let isSendSuccessful: boolean = subject.sendLetter(null, 1, roomID);

        expect(isSendSuccessful).to.be.false;
    });

    it("should not detect end of game when reserve is not empty", () => {
        subject.createRoomData();
        let reserve: Reserve = subject.getRoomReserve(roomID);
        for (let i = 0; i < 100; i++) {
            reserve.randomLetterGenerator();        //remove 100 letters from reserve
        }

        let isSendSuccessful: boolean = subject.sendLetter(null, 1, roomID);

        expect(isSendSuccessful).to.be.true;
    });
});
