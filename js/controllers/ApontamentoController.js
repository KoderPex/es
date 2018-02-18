//import {apontamento} from '../models/apontamento';
//import {ListaApontamentos} from '../models/ListaApontamentos';
//import {Mensagem} from '../models/Mensagem';
//import {ApontamentosView} from '../views/ApontamentosView';
//import {MensagemView} from '../views/MensagemView';
//import {ApontamentoService} from '../services/ApontamentoService';
//import {Bind} from '../helpers/Bind';

class ApontamentoController {

    constructor() {
        this._inputData = $('#data');

        this._listaApontamentos = new Bind(
            new ListaApontamentos(),
            new ApontamentosListView($('#apontamentosView')),
            'adiciona'
        );

        this._service = new ApontamentoService();

        this._init();
    }

    _init() {
        this._service
            .lista()
            .then( apontamentos => this.atualizaListaLocal(apontamentos) )
            .catch( () => this.importaApontamentos() );
    }

    adiciona(event) {
        event.preventDefault();
        this.insertApontamento(this._criaApontamento());
        //this._mensagem.texto = 'Apontamento adicionado com sucesso';
    }

    insertApontamento(apontamento) {
        this._service
            .cadastra(apontamento)
            .then( () => {
                this._listaApontamentos.adiciona(apontamento);
                this._limpaFormulario();
        })
        .catch(
            //error => this._mensagem.texto = error
        );
    }

    importaApontamentos() {
        new BaseService()
            .importarApontamentos(this._listaApontamentos.apontamentos)
            .then( apontamentos => this.atualizaListaLocal(apontamentos) );
    }

    atualizaListaLocal(apontamentos) {
        return apontamentos.forEach(apontamento =>
                this._listaApontamentos.adiciona(apontamento));
    }

    _criaApontamento() {
        return new apontamento(
            DateHelper.textoParaData(this._inputData.val())
        )
    }

    _limpaFormulario(){
        this._inputData.val('');
        this._inputData.focus();
    }

    apaga() {
        this._service
            .apaga()
            .then( mensagem => {
                //this._mensagem.texto = mensagem;
                this._listaApontamentos.esvazia();
            })
            //.catch(error => this._mensagem.texto = error);
    }

}
