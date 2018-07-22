class BaseService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory.getConnection();
    }

    importarAlunos() {
        return this.obterNomes()
            .then(nomes => this.insertNomes(nomes) )
            .catch( error => console.log(error) );
    }

    obterNomes() {
        return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/nomes/')
            .then(nomes => nomes.map(o => NomeDAO.instance(o)))
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter os nomes');
            });
    }

    insertNomes(nomes) {
        return new Promise((resolve, reject) => {
            this.daoFactory
                .then(connection => new NomeDAO(connection))
                .then(dao => {
                    dao.clear();
                    nomes.forEach(nome =>
                        this.insert(dao, nome));
                    resolve(nomes);
                });
        });
    }

    insert(dao,item) {
        return dao.adiciona(item)
          .catch(erro => {
             console.log(erro);
             throw new Error("Não foi possível adicionar")
         });
    }

    importarClasses(listaAtual) {
        return this.obterClasses()
                .then(classes =>
                    classes.filter(classe =>
                        !listaAtual.some(classeExistente =>
                            classe.isEquals(classeExistente))))
                .then( classes => this.insertClasses(classes) )
                .catch(error => {
                    console.log(error);
            });
    }

    insertClasses(classes) {
        return new Promise((resolve, reject) => {
            this.daoFactory
                .then(connection => new ClasseDAO(connection))
                .then(dao => {
                    classes.forEach(classe =>
                        this.insert(dao, classe));
                    resolve(classes);
                });
        });
    }

   obterClasses() {
        return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/classes/')
            .then(classes => classes.map(o => ClasseDAO.instance(o)))
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter a base');
            });
   }

    insertApontamentos(apontamentos){
        return new Promise((resolve, reject) => {
            this.daoFactory
                .then(connection => new ApontamentoDAO(connection))
                .then(dao => {
                    apontamentos.forEach(apontamento =>
                        this.insert(dao, apontamento));
                    resolve(apontamentos);
                });
        });
    }

    importarApontamentos(listaAtual){
        return this.obterApontamentos()
                .then(apontamentos =>
                    apontamentos.filter(apontamento =>
                        !listaAtual.some(apontamentoExistente =>
                            apontamento.isEquals(apontamentoExistente)))
                )
                .then( apontamentos => this.insertApontamentos(apontamentos) )
                .catch( error => console.log(error) );
    }

   obterApontamentos() {
        return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/apontamentos/?id='+window.whoAmI.id)
            .then(apontamentos => apontamentos.map(o => ApontamentoDAO.instance(o)))
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter os apontamentos');
            });
    }

    sendApontamentos(){
        return new Promise( (resolve, reject) => {
            new ApontamentoService()
                .listaSync()
                .then(apontamentos => {
                    this._http.post('https://iasd-capaoredondo.com.br/escolasabatina/services/apontamentos/', apontamentos )
                        .then( () => resolve() )
                        .catch( () => reject() );
                })
                .catch( () => Promise.reject() );
        })
    }

    sendTransferencias(){
    }

}
