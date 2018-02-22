class Apontamento {

    constructor(id,dt,sq,vo,mb,pr,es,ms,rl,pg,vs,fg) {
        this._id = id;
        this._dt = new Date(dt.getTime()); //Programação defensiva
        this._sq = sq;
        this._vo = vo;
        this._mb = mb;
        this._pr = pr;
        this._es = es;
        this._ms = ms;
        this._rl = rl;
        this._pg = pg;
        this._vs = vs;
        this._fg = fg;
        Object.freeze(this); //isFrozen()
    }

    get id() {
        return this._id;
    }

    get dt() {
        return new Date(this._dt.getTime()); //Programação defensiva
    }

    get sq() {
        return this._sq;
    }

    get vo() {
        return this._vo;
    }

    get mb() {
        return this._mb;
    }

    get pr() {
        return this._pr;
    }

    get es() {
        return this._es;
    }

    get ms() {
        return this._ms;
    }

    get rl() {
        return this._rl;
    }

    get pg() {
        return this._pg;
    }

    get vs() {
        return this._vs;
    }

    get fg() {
        return this._fg;
    }

    isEquals(outroApontamento) {
        return (this._dt.getTime() == outroApontamento.dt.getTime());
    }
}

class ListaApontamentos {

    constructor() {
        this._apontamentos = [];
    }

    adiciona(apontamento) {
        this._apontamentos.push(apontamento);
        return this;
    }

    get apontamentos() {
        return [].concat(this._apontamentos);
    }

    esvazia() {
        this._apontamentos = [];
        return this;
    }

    ordena(criterio) {
        this._apontamentos.sort(criterio);
        return this;
    }

    inverteOrdem() {
        this._apontamentos.reverse();
        return this;
    }
}
