//import {Negociacao} from '../models/Negociacao';

class ApontamentoDAO extends DAO {

    constructor (connection) {
        super(connection, 'apontamentos');
    }

    static instance(o,nomes){
        return new Apontamento(
            o._id,
            o._dt instanceof Date && !isNaN(o._dt.valueOf()) ? o._dt : DateHelper.data(o._dt),
            o._sq,
            o._vo,
            o._mb,
            o._es,
            o._ms,
            o._rl,
            o._pg,
            o._fg,
            nomes
        );
    }

    get store() {
        return this._connection
                    .transaction([this._store],'readwrite')
                    .objectStore(this._store);

        //TRATANDO ERROS DE (ROLLBACK)
        //transaction.onabort = e => {
        //    console.log(e);
        //    console.log('Transação abortada');
        //};
    }

    listaTodos() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let apontamentos = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    apontamentos.push( ApontamentoDAO.instance(atual.value) );
                    atual.continue();
                } else {
                    if (apontamentos.length == 0) {
                        reject();
                    } else {
                        resolve(apontamentos);
                    }
                }
            };
        });
    }
}
