//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

class NomesService {

    constructor(){
        this._http = new HttpService();
    }

    get daoFactory() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new NomeDAO(connection));
    }

    lista(classeID = null) {
        return this.daoFactory
            .then(dao => dao.recupera(classeID))
            .catch(error => {
                console.log(error);
                throw new Error("Não foi possível obter os nomes");
            });
    }

}
