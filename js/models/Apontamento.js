class Apontamento {

    constructor(data,ofer,qtim,thr,qtal,names,id) {
        this._data = new Date(data.getTime()); //Programação defensiva
        this._ofer = ofer;
        this._qtim = qtim;
        this._qthr = thr;
        this._qtal = qtal;
        this._names = names;
        this._id = id;
        Object.freeze(this); //isFrozen()
    }
    
    get data() {
        return new Date(this._data.getTime()); //Programação defensiva
    }

    isEquals(outroApontamento) {        
        return this._data.getTime() == outroApontamento.data.getTime();
    }
}