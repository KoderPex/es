//import {Negociacao} from '../models/Negociacao';

class ClasseDAO extends DAO {

    constructor (connection) {
        super(connection,'classes');
    }

    recupera() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let classes = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    let dado = atual.value;
                    classes.push(new Classe(
                        dado._id,
                        dado._cd,
                        dado._ds,
                        dado._pub,
                        dado._per,
                        dado._seq
                    ));

                    atual.continue();
                } else {
                    resolve(classes);
                }
            };
        });
    }
}
