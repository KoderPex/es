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
                    console.log('Success in updating record');
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

class LogsDAO extends DAO {

    constructor (connection) {
        super(connection,'logs');
    }

    static instance(o){
        return new Log(
            o._id,
            o._ic,
            o._nm,
            o._pr,
            o._es
        );
    }

    recupera(id,ic) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let log = null;
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( atual.value._ic == ic && atual.value._id == id ) {
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

    contaPrEs(ic) {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let log = { pr: 0, es: 0 };
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    if ( atual.value._ic == ic ) {
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

}

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

class ClasseDAO extends DAO {

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
                    classes.push( ClasseDAO.instance(atual.value) );
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
                        classe = ClasseDAO.instance(atual.value);
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
                    whoami = new ClasseService().getClasseByID(atual.value._id);
                    atual.continue();
                } else {
                    resolve(whoami);
                }
            };
        });
    }

}

class ApontamentoDAO extends DAO {

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

    listaTodos() {
        return new Promise((resolve,reject) => {
            let cursor = this.store.openCursor();

            let apontamentos = [];
            cursor.onsuccess = e => {
                let atual = e.target.result;
                if (atual) {
                    apontamentos.push( ApontamentoDAO.instance(atual.value) );
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
                        log = { key: atual.key, value: ApontamentoDAO.instance(atual.value) };
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