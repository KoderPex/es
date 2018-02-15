//import {Negociacao} from '../models/Negociacao';

class ClasseDAO extends DAO {

    constructor (connection) {
        super(connection,'classes');
    }

    static newClasse(o){
        return new Classe(
            o._id,
            o._cd,
            o._ds,
            o._pb,
            o._pr,
            o._sq
        );
    }

    recupera() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let classes = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    classes.push( ClasseDAO.newClasse(atual.value) );
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
                        classe = ClasseDAO.newClasse(atual.value);
                    }
                    atual.continue();
                } else {
                    resolve(classe);
                }
            };
        });
    }
}
