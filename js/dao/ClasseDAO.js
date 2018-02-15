//import {Negociacao} from '../models/Negociacao';

class ClasseDAO extends DAO {

    constructor (connection) {
        super(connection,'classes');
    }

    _classData(dado){
        return new Classe(
            dado._id,
            dado._cd,
            dado._ds,
            dado._pub,
            dado._per,
            dado._seq
        );
    }

    recupera() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let classes = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    classes.push( this._classData(atual.value) );
                    atual.continue();
                } else {
                    resolve(classes);
                }
            };
        });
    }

    recuperaByID(pId) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let classe = null;
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if (atual.value._id == pId) {
                        classe = this._classData(atual.value);
                    }
                    atual.continue();
                } else {
                    resolve(classe);
                }
            };
        });
    }
}
