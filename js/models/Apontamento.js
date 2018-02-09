class Apontamento {

    constructor(data,ofer,qthr,qtal,names,id,fg,sq) {
        this._data = new Date(data.getTime()); //Programação defensiva
        this._ofer = ofer;
        this._qthr = qthr;
        this._qtal = qtal;
        this._names = names;
        this._id = id;
        this._fg = fg;
        this._sq = sq;
        Object.freeze(this); //isFrozen()
    }
    
    get data() {
        return new Date(this._data.getTime()); //Programação defensiva
    }

    get id() {
        return this._id;
    }

    get fg() {
        return this._fg;
    }

    get vl() {
        return this._ofer;
    }

    get al() {
        return this._qtal;
    }

    get hr() {
        return this._qthr;
    }

    get sq() {
        return this._sq;
    }

    isEquals(outroApontamento) {        
        return this._data.getTime() == outroApontamento.data.getTime();
    }
}