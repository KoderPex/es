class BaseService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory.getConnection();
    }

    importarMembros(listaAtual) {
        return this.obterMembros()
            .then(membros =>
                membros.filter(membro =>
                    !listaAtual.some(membroExistente =>
                        membros.isEquals(membroExistente))))
            .then(membros => this.insertMembros(membros))
            .catch(error => console.log(error));
    }

    obterMembros() {
        return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/membros/')
            .then(membros => membros.map(o => MembrosDAO.instance(o)))
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter os membros');
            });
    }

    insertMembros(membros) {
        return new Promise((resolve, reject) => {
            this.daoFactory
                .then(connection => new MembrosDAO(connection))
                .then(dao => {
                    dao.clear();
                    membros.forEach(membro =>
                        this.insert(dao, membro));
                    resolve(membros);
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
                .then(connection => new ClassesDAO(connection))
                .then(dao => {
                    classes.forEach(classe =>
                        this.insert(dao, classe));
                    resolve(classes);
                });
        });
    }

    obterClasses() {
            return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/classes/')
                .then(classes => classes.map(o => ClassesDAO.instance(o)))
                .catch(error => {
                    console.log(error);
                    throw new Error('Não foi possível obter a base');
                });
    }

    insertApontamentos(apontamentos){
        return new Promise((resolve, reject) => {
            this.daoFactory
                .then(connection => new ApontamentosDAO(connection))
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
            .then(apontamentos => apontamentos.map(o => ApontamentosDAO.instance(o)))
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter os apontamentos');
            });
    }

    sendLogs(){
        return new Promise((resolve, reject) => new LogsService()
            .lista()
            .catch(() => resolve())
            .then(logs => this._http.post('https://iasd-capaoredondo.com.br/escolasabatina/services/logs/', logs)
                .then(() => resolve())
                .catch(() => reject())
            )
        ); 
    };

    sendTransfs(){
        return new Promise((resolve, reject) => new TransfsService()
            .lista()
            .catch(() => resolve())
            .then(transfs => this._http.post('https://iasd-capaoredondo.com.br/escolasabatina/services/transfs/', transfs)
                .then(() => resolve())
                .catch(() => reject())
            )
        ); 
    };

    sendApontamentos(){
        return new Promise((resolve, reject) => new ApontamentosService()
            .listaSync()
            .catch(() => resolve())
            .then(apontamentos => this._http.post('https://iasd-capaoredondo.com.br/escolasabatina/services/apontamentos/', apontamentos)
                .then(() => resolve())
                .catch(() => reject())
            )
        );
    }

    sendTransferencias(){
        return this.sendApontamentos()
            .then(() => this.sendLogs())
            .then(() => this.sendTransfs())
        ;
    }

}
