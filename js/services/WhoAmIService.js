//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

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
