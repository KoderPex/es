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

