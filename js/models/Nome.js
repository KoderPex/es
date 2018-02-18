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

class ListaNomes {

    constructor() {
        this._nomes = [];
    }

    adiciona(nome) {
        this._nomes.push(nome);
        return this;
    }

    get nomes() {
        return [].concat(this._nomes);
    }

    esvazia() {
        this._nomes = [];
        return this;
    }
}
