class ApontamentoService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new ApontamentoDAO(connection));
    }

    cadastra(apontamento) {
        return this.daoFactory
            .then(dao => dao.adiciona(apontamento))
            .catch(error => {
               console.log(error);
               throw new Error("Não foi possível adicionar base")
           });
   }

   lista() {
        return this.daoFactory
            .then(dao => dao.listaTodos());
   }

   listaSync() {
        return this.daoFactory
            .then(dao => dao.listaTodos({field:'_fg', value:'1'}));
   }

   update(index, what, value) {
        return this.daoFactory
            .then(dao => dao.atualiza(index, what, value))
            .catch(error => {
            console.log(error);
            throw new Error("Não foi possível atualizar o apontamento")
        })
    }

    updateObj(obj){
        return this.daoFactory
            .then(dao => dao.atualizaObj(obj))
            .catch(error => {
            console.log(error);
            throw new Error("Não foi possível atualizar o apontamento")
        })
    }

    recupera(id) {
        return this.daoFactory
            .then(dao => dao.recupera(id));
    }


    truncate(){
        this.daoFactory
            .then(dao => dao.clear());
    }

}

class ClasseService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new ClasseDAO(connection));
    }

    lista() {
        return this.daoFactory
            .then(dao => dao.recupera())
            .catch(error => {
                console.log(error);
                throw new Error("Não foi possível obter as classees");
            });
    }

    getClasseByID(pId){
        return this.daoFactory
            .then(dao => dao.recuperaByID(pId))
            .catch(error => {
                console.log(error);
                throw new Error("Não foi possível obter a classe");
            });
    }
}

class NomesService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NomeDAO(connection));
    }

    lista(whoAmIId = null) {
        return this.daoFactory
            .then(dao => dao.recupera(whoAmIId));
    }

    aceitarTransferencia(id) {
        return this.daoFactory
            .then(dao => dao.recuperaPorId(id)
                .then(res => dao.atualiza(res.key, 'ns', false)))
    }

}

class WhoAmIService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new WhoAmIDAO(connection));
    }

    cadastra(classe) {
        return this.daoFactory
            .then(dao => dao.adiciona(classe))
            .catch(erro => {
               console.log(erro);
               throw new Error("Não foi possível adicionar classe")
           });
   }

   verifica() {
        return new Promise((resolve,reject) => {
            this.daoFactory
                .then(dao => dao.recupera())
                .then( whoami => {
                    if (whoami == null) {
                        reject(whoami);
                    } else {
                        resolve(whoami);
                    }
                })
            .catch(error => {
                console.log(error);
                throw new Error("Não foi possível obter a classe");
            })
        });
   }

}

class LogsService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new LogsDAO(connection));
    }

    updateLog(index, what, value) {
        return this.daoFactory
            .then(dao => dao.atualiza(index, what, value))
            .catch(error => {
            console.log(error);
            throw new Error("Não foi possível atualizar o log")
        })
    }

    cadastra(log) {
        return this.daoFactory
            .then(dao => dao.adiciona(log))
            .catch(error => {
               console.log(error);
               throw new Error("Não foi possível adicionar log")
           });
    }

    recupera(id,ic) {
        return this.daoFactory
            .then(dao => dao.recupera(id,ic));
    }

    contaPrEs(ic) {
        return this.daoFactory
            .then(dao => dao.contaPrEs(ic));
    }

}
