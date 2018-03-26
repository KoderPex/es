class Nome {

    constructor(id,ic,nm) {
        this._id = id;
        this._ic = ic;
        this._nm = nm;
        this._ns = false;
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

    get ns(){
        return this._ns;
    }

    set ns(_ns){
        this._ns = _ns;
        return this;
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

class Log extends Nome {

    constructor(id,ic,nm,pr,es) {
        super(id,ic,nm);
        this._pr = pr;
        this._es = es;
        Object.freeze(this); //isFrozen()
    }

    get pr() {
        return this._pr;
    }

    get es() {
        return this._es;
    }

}

class ListaLogs {
    constructor() {
        this._logs = [];
    }

    adiciona(log) {
        this._logs.push(log);
        return this;
    }

    get logs() {
        return [].concat(this._logs);
    }

    refresh() {}

    esvazia() {
        this._logs = [];
        return this;
    }
}

class Classe {

    constructor(id,cd,ds,pb,pr,sq) {
        this._id = id;
        this._cd = cd;
        this._ds = ds;
        this._pb = pb;
        this._pr = pr;
        this._sq = sq;
        Object.freeze(this); //isFrozen()
    }

    get id() {
        return this._id;
    }

    get cd() {
        return this._cd;
    }

    get ds() {
        return this._ds;
    }

    get pb() {
        return this._pb;
    }

    get pr() {
        return this._pr;
    }

    get sq() {
        return this._sq;
    }

    isEquals(outraClasse) {
        return (this._id == outraClasse.id);
    }
}

class ListaClasses {

    constructor() {
        this._classes = [];
    }

    adiciona(classe) {
        this._classes.push(classe);
        return this;
    }

    get classes() {
        return [].concat(this._classes);
    }

    esvazia() {
        this._classes = [];
        return this;
    }
}

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

    set pr(_pr) {
        this._pr = _pr;
        return this;
    }

    set es(_es) {
        this._es = _es;
        return this;
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

    set fg(_fg) {
        this._fg = _fg;
        return this;
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
