class ListaClasses {

    constructor() {
        this._classes = [];
    }

    adiciona(classe) {
        this._classes.push(classe);
    }

    get classes() {
        return [].concat(this._classes);
    }

    esvazia() {
        this._classes = [];
    }
}
