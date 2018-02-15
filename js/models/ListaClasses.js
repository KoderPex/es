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
