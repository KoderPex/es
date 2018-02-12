//import {Negociacao} from '../models/Negociacao';

class WhoAmIDAO extends DAO {

    constructor (connection) {
        super(connection,'whoami');
    }

    recupera() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let whoami = null;
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    whoami = new WhoAmI(atual.value._id);
                    atual.continue();
                } else {
                    resolve(whoami);
                }
            };
        });
    }
}
