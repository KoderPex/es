class ListaApontamentos {

    constructor() {
        this._apontamentos = [];
    }

    adiciona(apontamento) {
        this._apontamentos.push(apontamento);
    }

    get apontamentos() {
        return [].concat(this._apontamentos);
    }

    esvazia() {
        this._apontamentos = [];
    }

    ordena(criterio) {
        this._apontamentos.sort(criterio);        
    }

    inverteOrdem() {
        this._apontamentos.reverse();
    }
}