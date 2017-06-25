export class Player {

    private name: string;
    private score: number;
    private nbTiles: number;
    private priority: number;
    private isWinner: boolean;
    private isConnected: boolean;

    public constructor(name: string, priority: number) {
        this.name = name;
        this.score = 0;
        this.nbTiles = 7;
        this.priority = priority;
        this.isWinner = false;
        this.isConnected = true;
    }

    public getName(): string {
        return this.name;
    }

    public getScore(): number {
        return this.score;
    }

    public getPriority(): number {
        return this.priority;
    }

    public getNbTiles(): number {
        return this.nbTiles;
    }

    public getWinner(): boolean {
        return this.isWinner;
    }

    public getIsConnected(): boolean {
        return this.isConnected;
    }

    public setScore(score: number) {
        this.score = score;
    }

    public setPriority(priority: number) {
        this.priority = priority;
    }

    public setWinner(isWinner: boolean) {
        this.isWinner = isWinner;
    }

    public setIsConnected(isConnected: boolean) {
        this.isConnected = isConnected;
    }

    public addTile(nbTiles: number) {
        this.nbTiles += nbTiles;
    }

    public equal(player: Player): boolean {
        return this.name === player.name;
    }
}
