class Nome {

    constructor(id,ic,nm) {
        this._id = id;
        this._ic = ic;
        this._nm = nm;
        Object.freeze(this); //isFrozen()
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

    isEquals(outro) {
        return this._id == outro.id;
    }
}
