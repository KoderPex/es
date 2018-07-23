class DAO {

    constructor (connection,store) {
        this._connection = connection;
        this._store = store;
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

    clear(){
        return this._connection
            .transaction([this._store],'readwrite')
            .objectStore(this._store)
            .clear();
    }

    atualiza(index,what,value){
        return new Promise((resolve,reject) => {
            let request = this.store.get(index);
            request.onsuccess = e => {
                var data = e.target.result;
                data['_'+what] = value;

                var objRequest = this.store.put(data, index);
                objRequest.onsuccess = function(e){
                    resolve();
                    console.log('Success in updating record');
                };
            };
            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível atualizar o item.');
            };
        });
    }

    atualizaObj(obj){
        return new Promise((resolve,reject) => {
            let request = this.store.get(obj.key);
            request.onsuccess = e => {
                var data = e.target.result;
                var objRequest = this.store.put(obj.value, obj.key);
                objRequest.onsuccess = function(e){
                    resolve();
                    //console.log('Success in updating record');
                };
            };
            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível atualizar o item.');
            };
        });
    }

    adiciona(item){
        return new Promise((resolve,reject) => {
            let request = this.store.add(item);

            request.onsuccess = e => {
                resolve('objeto adicionado com sucesso em '+this._store);
            };
            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível adicionar o item.');
            };
        });
    }

}

class TransfsDAO extends DAO {

    constructor (connection) {
        super(connection,'transfs');
    }

    static instance(o){
        return new Transf(
            o._id,
            o._co,
            o._cd
        );
    }

    listaTodos(selection) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let transfs = [];
            let add = false
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    add = (!selection || (selection && atual.value[selection.field] == selection.value));
                    if (add){
                        transfs.push( TransfsDAO.instance(atual.value) );
                    }
                    atual.continue();
                } else if (transfs.length == 0) {
                    reject();
                } else {
                    resolve(transfs);
                }
            };
        });
    }

}

class LogsDAO extends DAO {

    constructor (connection) {
        super(connection,'logs');
    }

    static instance(o){
        return new Log(
            o._il,
            o._ic,
            o._id,
            o._nm,
            o._pr,
            o._es
        );
    }

    recupera(il,id,ic) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let log = null;
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( atual.value._il == il && atual.value._ic == ic && atual.value._id == id ) {
                        log = { key: atual.key, value: LogsDAO.instance(atual.value) };
                    }
                    atual.continue();
                } else if (log !== null) {
                    resolve(log);
                } else {
                    reject();
                }
            };
        });
    }

    contaPrEs(il,ic) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let log = { pr: 0, es: 0 };
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( atual.value._il == il && atual.value._ic == ic ) {
                        if ( atual.value._pr ) {
                            log.pr++;
                        }
                        if ( atual.value._es ) {
                            log.es++;
                        }
                    }
                    atual.continue();
                } else if (log !== null) {
                    resolve(log);
                } else {
                    reject();
                }
            };
        });

    }

    listaTodos(selection) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let logs = [];
            let add = false
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    add = (!selection || (selection && atual.value[selection.field] == selection.value));
                    if (add){
                        logs.push( LogsDAO.instance(atual.value) );
                    }
                    atual.continue();
                } else if (logs.length == 0) {
                    reject();
                } else {
                    resolve(logs);
                }
            };
        });
    }

}

class MembrosDAO extends DAO {

    constructor (connection) {
        super(connection,'membros');
    }

    static instance(o){
        return new Membro(
            o._id,
            o._ic,
            o._nm,
            o._ns
        );
    }

    recupera(whoAmIId = null) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let membros = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( whoAmIId == null || atual.value._ic == whoAmIId ) {
                        membros.push( MembrosDAO.instance(atual.value) );
                    }
                    atual.continue();
                } else if (membros.length == 0) {
                    reject();
                } else {
                    resolve(membros);
                }
            };
        });
    }

    recuperaPorId(id) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let log = null;
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( atual.value._id == id ) {
                        log = { key: atual.key, value: MembrosDAO.instance(atual.value) };
                    }
                    atual.continue();
                } else if (log !== null) {
                    resolve(log);
                } else {
                    reject();
                }
            };
        });
    }

}

class ClassesDAO extends DAO {

    constructor (connection) {
        super(connection,'classes');
    }

    static instance(o){
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
                    classes.push( ClassesDAO.instance(atual.value) );
                    atual.continue();
                } else if (classes.length == 0) {
                    reject(classes);
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
                        classe = ClassesDAO.instance(atual.value);
                    }
                    atual.continue();
                } else {
                    resolve(classe);
                }
            };
        });
    }
}

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
                    whoami = new ClassesService().getClasseByID(atual.value._id);
                    atual.continue();
                } else {
                    resolve(whoami);
                }
            };
        });
    }

}

class ApontamentosDAO extends DAO {

    constructor (connection) {
        super(connection, 'apontamentos');
    }

    static instance(o){
        return new Apontamento(
            o._id,
            o._dt instanceof Date && !isNaN(o._dt.valueOf()) ? o._dt : DateHelper.data(o._dt),
            o._sq,
            o._vo,
            o._mb,
            o._pr,
            o._es,
            o._ms,
            o._rl,
            o._pg,
            o._vs,
            o._fg
        );
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

    listaTodos(selection) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let apontamentos = [];
            let add = false
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    add = (!selection || (selection && atual.value[selection.field] == selection.value));
                    if (add){
                        apontamentos.push( ApontamentosDAO.instance(atual.value) );
                    }
                    atual.continue();
                } else if (apontamentos.length == 0) {
                    reject();
                } else {
                    resolve(apontamentos);
                }
            };
        });
    }

    recupera(id) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let log = null;
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( atual.value._id == id ) {
                        log = { key: atual.key, value: ApontamentosDAO.instance(atual.value) };
                    }
                    atual.continue();
                } else if (log !== null) {
                    resolve(log);
                } else {
                    reject();
                }
            };
        });
    }
}
