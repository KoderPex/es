//import {Negociacao} from '../models/Negociacao';

class NomeDAO extends DAO {

    constructor (connection) {
        super(connection,'nomes');
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
