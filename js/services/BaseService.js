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

   importarClasses(){
       return this.obterClasses()
                .then( classes => this.insertClasses(classes) )
                .catch(error => {
                    console.log(error);
                    throw new Error('Não foi possível obter a base');
            });
    }

    insertClasses(classes){
        return new Promise((resolve, reject) => {
            this.daoFactory
                .then(connection => new ClasseDAO(connection))
                .then(dao => {
                    dao.clear();
                    classes.forEach(classe =>
                        this.insertClasse(dao, new Classe(
                            classe.id,
                            classe.cd,
                            classe.ds,
                            classe.pub,
                            classe.per,
                            classe.sq
                        )) );
                    resolve();
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
                    dao.clear();
                    apontamentos.forEach(apontamento =>
                        this.insertApontamento(dao, new Apontamento(
                            apontamento.id,
                            DateHelper.data(apontamento.data),
                            apontamento.sq,
                            apontamento.vlof,
                            apontamento.qtes,
                            apontamento.qtms,
                            apontamento.qtrl,
                            apontamento.qtpg,
                            apontamento.fg,
                        )) );
                    resolve();
                });
        });
    }

    importarApontamentos(listaAtual){
        return this.obterApontamentos()
                .then( apontamentos => this.insertApontamentos(apontamentos) )
                .catch(error => {
                    console.log(error);
                    throw new Error('Não foi possível obter a base');
            });
    }

   obterApontamentos() {
        return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/?id='+window.classeID)
                .catch(error => {
                    console.log(error);
                    throw new Error('Não foi possível obter os apontamentos');
                });
}


}
