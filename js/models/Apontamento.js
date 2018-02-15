class Apontamento {

    constructor(id,data,sq,vlof,qtes,qtms,qtrl,qtpg,fg) {
        this._id = id;
        this._data = new Date(data.getTime()); //Programação defensiva
        this._sq = sq;
        this._vlof = vlof;
        this._qtes = qtes;
        this._qtms = qtms;
        this._qtrl = qtrl;
        this._qtpg = qtpg;
        this._fg = fg;
        Object.freeze(this); //isFrozen()
    }
    
    get id() {
        return this._id;
    }

    get data() {
        return new Date(this._data.getTime()); //Programação defensiva
    }

    get sq() {
        return this._sq;
    }

    get vl() {
        return this._vlof;
    }

    get es() {
        return this._qtes;
    }

    get ms() {
        return this._qtms;
    }

    get rl() {
        return this._qtrl;
    }

    get pg() {
        return this._qtpg;
    }

    get fg() {
        return this._fg;
    }

    isEquals(outroApontamento) {        
        return this._data.getTime() == outroApontamento.data.getTime();
    }
}