//import {apontamento} from '../models/apontamento';
//import {ListaApontamentos} from '../models/ListaApontamentos';
//import {Mensagem} from '../models/Mensagem';
//import {ApontamentosView} from '../views/ApontamentosView';
//import {MensagemView} from '../views/MensagemView';
//import {ApontamentoService} from '../services/ApontamentoService';
//import {Bind} from '../helpers/Bind';

class MaestroController {

    constructor() {
        this._populateClasses = new Bind(
            new ListaClasses(),
            new InputClassView($('#inputClasseView')),
            'adiciona'
        );
        this._init();
    }

    _init() {
        this.iniciaInformacoesdaClasse();
        new WhoAmIService().verifica()
            .then( whoami => {
                if (whoami == null) {
                    Promise.all([
                        this.importaClasses()
                    ])
                    .then( () => {
                        this.escolhe();
                    })
                    .catch(erro => {
                        throw new Error(erro);
                    });
                }
            })
            .catch( error => console.log(error) );



        //01 - SE BASE (local) NAO EXISTE, PRECISA CRIAR.
        //  AO CRIAR A BASE (local), GRAVAR NA ESTRUTURA whoami, AS INFORMACOES DA CLASSE.
        //  AO CLICAR NO BOTAO REDEFINIR CLASSE, APAGAR AS INFORMACOES DE whoami.

        //02 - SE BASE (local) NAO EXISTE, PRECISA IMPORTAR AS INFORMACOES DE ACORDOM COM whoami.
        //  TENTAR SE CONECTAR PARA BAIXAR.
        //  SE NAO CONSEGUIU BAIXAR, PROGRAMA TENTATIVA PARA 1:30.
        //  VERIFICA SE TODAS AS CLASSES SUBMETERAM AS ATUALIZACOES (host).
        //  SE HA CLASSES A SUBMETER, PROGRAMA TENTATIVA PARA 1:30.
        //  SE TODAS AS CLASSES ATUALIZADAS (host), MARCA CLASSE ATUALIZADA, RE-CRIA BANCO (local).

        //03 - SE BASE (local) EXISTE, VERIFICAR SE PRECISA ENVIAR (host) APONTAMENTOS FECHADOS.
        //  TENTAR SE CONECTAR (host) PARA ENVIAR.
        //  SE NAO CONSEGUIU ENVIAR, PROGRAMA TENTATIVA PARA OS PROXIMOS 5:00.
        //  SE CONSEGUIR ENVIAR, APAGA A BASE (local) DE CLASSES/PESSOAS/APONTAMENTOS, E VOLTA PARA O PASSO 1.

        //FLAGS
        //0 - EM ABERTO
        //1 - PRONTO PARA ENVIO
        //2 - ATUALIZADO

        //setInterval( () => this.importaApontamentos(), 10000);
        //SsetTimeout( () => this.importaApontamentos(), 10000);
    }

    iniciaInformacoesdaClasse(){
        $("#divHeaderClasse, #liTabMembros, #liTabApontamentos, #buttonsView").hide();
    }

    importaClasses(){
        new BaseService().importarClasses();
    }

    escolhe(){
        new ClasseService()
            .lista()
            .then(classes => {
                classes.forEach(classe =>
                    this._populateClasses.adiciona(classe)
                )
                $("#btnGravarWhoAmI").enable( false );
                $("#cmbWhoAmI").on('change', function(event){
                    $("#btnGravarWhoAmI").enable( ($(this).selectpicker('val') != '') );
                });
                $("#btnGravarWhoAmI").unbind('click').on('click', function(event){
                    console.log('gravar id escolhido em whoami');
                    console.log(event.target);
                });
            })
            .catch(error => {
                //this._mensagem.texto = error;
            });
    }

}
