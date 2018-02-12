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
        return this.daoFactory
            .then(dao => dao.recupera())
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível obter a classe");
            });
   }

}
