//import {Negociacao} from '../models/Negociacao';

class ApontamentoDAO {

    constructor (connection) {
        this._connection = connection;
        this._store = 'apontamentos';
        Object.freeze(this);
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

    adiciona(apontamento){
        return new Promise((resolve,reject) => {
            let request = this.store.add(apontamento);

            request.onsuccess = e => {
                resolve();
            };
    
            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível adicionar o apontamento.');
            };
        });
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
                        dado._data,
                        dado._ofer,
                        dado._qthr,
                        dado._qtal,
                        dado._names,
                        dado._id,
                        dado._fg,
                        dado._sq
                    ));

                    atual.continue();
                } else { 
                    resolve(apontamentos);
                }
            };
        });
    }
}