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
       this.obterClasses()
            .then( classes => {
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
                    });
            })
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter a base');
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


}
