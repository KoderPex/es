//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

class BaseService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory.getConnection();
    }

    importarAlunos() {
        return new Promise((resolve, reject) => resolve());
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
                        this.insertClasse(dao, classe));
                    resolve(classes);
                });
        });
    }

    insertClasse(dao,classe) {
        return dao.adiciona(classe)
          .catch(erro => {
             console.log(erro);
             throw new Error("Não foi possível adicionar")
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

   insertApontamento(dao,apontamento) {
        return dao.adiciona(apontamento)
        .catch(erro => {
            console.log(erro);
            throw new Error("Não foi possível adicionar")
        });
    }

    insertApontamentos(apontamentos){
        return new Promise((resolve, reject) => {
            this.daoFactory
                .then(connection => new ApontamentoDAO(connection))
                .then(dao => {
                    apontamentos.forEach(apontamento =>
                        this.insertApontamento(dao, apontamento));
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
                .catch(error => {
                    console.log(error);
            });
    }

   obterApontamentos() {
        return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/?id='+window.classeID)
                .then(apontamentos => apontamentos.map(o => ApontamentoDAO.instance(o)))
                .catch(error => {
                    console.log(error);
                    throw new Error('Não foi possível obter os apontamentos');
                });
    }


}
