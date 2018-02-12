//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

class BaseService {

    constructor(){
        this._http = new HttpService();
    }

    obterBase() {
        return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/')
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter a base');
            });
    }

    parseApontamentos(base){
        return base.then( base => base.ap.map( o =>
                new Apontamento(
                    DateHelper.data(o.data),
                    o.ofer,
                    o.qthr,
                    o.qtal,
                    o.qtvs,
                    o.names,
                    o.id,
                    o.fg,
                    o.sq
                )
            )
        )
    }

    parseNomes(base){
        return base.then( base => base.nm.map( o =>
                new Nome(
                    o.id,
                    o.ic,
                    o.nm,
                    DateHelper.data(o.dt)
                )
            )
        )
    }

    parseClasses(base){
        return base.then( base => base.cl.map( o =>
                new Classe(
                    o.id,
                    o.ic,
                    o.nm,
                    DateHelper.data(o.dt)
                )
            )
        )
    }

    get daoFactory() {
        return ConnectionFactory.getConnection();
    }

    cadastra(base) {
        return this.daoFactory
            .then(connection => new ApontamentoDAO(connection))
                .then(dao => dao.adiciona(base.ap))
            .catch(erro => {
               console.log(erro);
               throw new Error("Não foi possível adicionar")
           });
   }

   obterClasses() {
       return this._http.get('https://iasd-capaoredondo.com.br/escolasabatina/services/whoami/')
           .catch(error => {
               console.log(error);
               throw new Error('Não foi possível obter a base');
           });

   }

}
