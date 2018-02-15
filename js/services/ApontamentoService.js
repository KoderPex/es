//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

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
            .then(dao => dao.listaTodos())
            .catch(error => {
                console.log(error);
                throw new Error("Não foi possível obter as apontamentos");
            });
   }

}