//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

class BaseService {

    constructor(){
        this._http = new HttpService();
    }

    obterBase() {
        return this._http.get('http://iasd-capaoredondo.com.br/escolasabatina/services/')
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
        return base.then( base => base.ap.map( o => 
                new Nome(
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

    cadastra(nase) {
        return this.daoFactory
            .then(connection => new ApontamentoDAO(connection))
                .then(dao => dao.adiciona(base))
            .then(connection => new NomeDAO(connection))
                .then(dao => dao.adiciona(apontamento))
            .catch(erro => {
               console.log(erro);
               throw new Error("Não foi possível adicionar")
           });
   }

   importa(listaAtual) {
        return this.obterBase()
            .then( base => parseApontamentos(base) )
                .then(apontamentos =>
                    apontamentos.filter(apontamento =>
                        !listaAtual.some(apontamentoExistente =>
                            apontamento.isEquals(apontamentoExistente)))
                )
            .then( base => parseNomes(base) )
                .then(nomes =>
                    nomes.filter(nome =>
                        !listaAtual.some(nomeExistente =>
                            nome.isEquals(nomeExistente)))
                )
            .catch( erro => {
                console.log(erro);
                throw new Error("Não foi possível buscar a base para importar");
            });  
   }

}