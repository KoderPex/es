//import {Negociacao} from '../models/Negociacao';

class ApontamentoDAO extends DAO {

    constructor (connection) {
        super(connection, 'apontamentos');
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
                    let dado = atual.value;
                    apontamentos.push(new Apontamento(
                        dado._id,
                        dado._data,
                        dado._sq,
                        dado._vlof,
                        dado._qtes,
                        dado._qtms,
                        dado._qtrl,
                        dado._qtpg,
                        dado._fg,
                    ));

                    atual.continue();
                } else {
                    resolve(apontamentos);
                }
            };
        });
    }
}
