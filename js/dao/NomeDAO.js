//import {Negociacao} from '../models/Negociacao';

class NomeDAO extends DAO {

    constructor (connection) {
        super(connection,'nomes');
    }

    static instance(o){
        return new Nome(
            o._id,
            o._ic,
            o._nm
        );
    }

    recupera(classeID = null) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let nomes = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( classeID == null || atual.value._ic == classeID ) {
                        nomes.push( NomeDAO.instance(atual.value) );
                    }
                    atual.continue();
                } else if (nomes.length == 0) {
                    reject();
                } else {
                    resolve(nomes);
                }
            };
        });
    }

}
