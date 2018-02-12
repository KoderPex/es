//import {Negociacao} from '../models/Negociacao';

class WhoAmIDAO extends DAO {

    constructor (connection) {
        super(connection,'whoami');
    }

    recupera() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let classe = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    let dado = atual.value;
                    nomes.push(new WhoAMI(
                        dado._id,
                        dado._cd,
                        dado._ds,
                        dado._pub,
                        dado._per,
                        dado._seq
                    ));

                    atual.continue();
                } else {
                    resolve(classe);
                }
            };
        });
    }
}
