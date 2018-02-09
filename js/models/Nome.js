class Nome {

    constructor(id,ic,nm,dt) {
        this._id = id;
        this._ic = ic;
        this._nm = nm;
        this._dt = new Date(dt.getTime()); //Programação defensiva
        Object.freeze(this); //isFrozen()
    }
    
    get dt() {
        return new Date(this._dt.getTime()); //Programação defensiva
    }

    get id() {
        return this._id;
    }

    get ic() {
        return this._ic;
    }

    get nm() {
        return this._nm;
    }

    isEquals(outroApontamento) {        
        return this._id == outroApontamento.id;
    }
}