
class DbController{

    private id : number;
    constructor(id: number){
        this.id = id;
    }
    /**
     * name
     */
    public getSomething() {
        return "Something";
    }
    public getId(){
        return this.id;
    }

    public giveMeError(){
        throw new Error('You asked for it');
    }

}

export {DbController}
