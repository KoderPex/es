//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

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

    getClassByID(pId){
        return this.daoFactory
            .then(dao => dao.recuperaByID(pId))
            .catch(error => {
                console.log(error);
                throw new Error("Não foi possível obter a classe");
            });
    }
}
