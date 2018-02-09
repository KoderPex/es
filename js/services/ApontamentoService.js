//import {HttpService} from '../services/HttpService';
//import {ConnectionFactory} from '../services/ConnectionFactory';
//import {Apontamento} from '../models/Apontamento';
//import {ApontamentoDAO} from '../dao/ApontamentoDAO';

class ApontamentoService {

    constructor(){
        this._http = new HttpService();
    }

    obterApontamentos() {
        return this._http.get('http://iasd-capaoredondo.com.br/escolasabatina/mock.php')
            .then(apontamentos => 
                apontamentos.map(o => 
                    new Apontamento(
                        new Date(o.data),
                        o.ofer,
                        o.qtim,
                        o.qthr,
                        o.qtal,
                        o.names,
                        o.id                     
                    )
                )
            )
            .catch(error => {
                console.log(error);
                throw new Error('Não foi possível obter as apontamentos da semana.');
            });
    }

    get daoFactory() {
        return ConnectionFactory
            .getConnection()
            .then(connection => new ApontamentoDAO(connection));
    }

    cadastra(apontamento) {
        return this.daoFactory
           .then(dao => dao.adiciona(apontamento))
           .catch(erro => {
               console.log(erro);
               throw new Error("Não foi possível adicionar a negociação")
           });
   }

   lista() {
        return this.daoFactory
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error("Não foi possível obter as apontamentos");
            });
   }

   importa(listaAtual) {
        return this.obterApontamentos()
            .then(apontamentos =>
                apontamentos.filter(apontamento =>
                    !listaAtual.some(apontamentoExistente =>
                        apontamento.isEquals(apontamentoExistente)))
            )
            .catch( erro => {
                console.log(erro);
                throw new Error("Não foi possível buscar as apontamentos para importar");
            });  
   }

}