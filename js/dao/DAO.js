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

    adiciona(item){
        return new Promise((resolve,reject) => {
            let request = this.store.add(item);

            request.onsuccess = e => {
                resolve();
            };

            request.onerror = e => {
                console.log(e.target.error);
                reject('Não foi possível adicionar o item.');
            };
        });
    }

}
