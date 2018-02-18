//import {apontamento} from '../models/apontamento';
//import {ListaApontamentos} from '../models/ListaApontamentos';
//import {Mensagem} from '../models/Mensagem';
//import {ApontamentosView} from '../views/ApontamentosView';
//import {MensagemView} from '../views/MensagemView';
//import {ApontamentoService} from '../services/ApontamentoService';
//import {Bind} from '../helpers/Bind';

class MembrosController {

    constructor() {
        this._listaNomes = new Bind(
            new ListaNomes(),
            new ApontamentosNomesListView($('#apontamentosNomesView')),
            'adiciona'
        );

        this._service = new NomesService();

        this._init();
    }

    _init() {
        this._service
            .lista(window.classeID)
            .then( nomes => this.atualizaListaLocal(nomes) )
            .catch(error => {
                console.log(error);
                //this._mensagem.texto = error;
            });
    }

    atualizaListaLocal(nomes) {
        return nomes.forEach(nome =>
                this._listaNomes.adiciona(nome));
    }

}
