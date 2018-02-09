//import {Negociacao} from '../models/Negociacao';

class NomeDAO {

    constructor (connection) {
        this._connection = connection;
        this._store = 'nomes';
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

    adiciona(nome){
        return new Promise((resolve,reject) => {
            let request = this.store.add(nome);

            request.onsuccess = e => {
                resolve();
            };
    
            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível adicionar o nome.');
            };
        });
    }

    listaTodos() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();
                
            let nomes = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    let dado = atual.value;
                    nomes.push(new Nome(
                        dado._id,
                        dado._ic,
                        dado._nm,
                        dado._dt
                    ));

                    atual.continue();
                } else { 
                    resolve(nomes);
                }
            };
        });
    }
}