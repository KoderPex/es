//import {apontamento} from '../models/apontamento';
//import {ListaApontamentos} from '../models/ListaApontamentos';
//import {Mensagem} from '../models/Mensagem';
//import {ApontamentosView} from '../views/ApontamentosView';
//import {MensagemView} from '../views/MensagemView';
//import {ApontamentoService} from '../services/ApontamentoService';
//import {Bind} from '../helpers/Bind';

class MaestroController {

    constructor() {
        this._listaClasses = new Bind(
            new ListaClasses(),
            new InputClassView($('#inputClasseView')),
            'adiciona','esvazia'
        );
        this._classeService = new ClasseService();
        this._whoAmIService = new WhoAmIService();
        this._baseService = new BaseService();
        this._init();
    }

    _init() {
        this._baseService.importarAlunos();
        this.iniciaInformacoesdaClasse();
        this.recuperaClasse();

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
        //setTimeout( () => this.recuperaClasse(), 5000);
    }

    loadClasses() {
        let instance = this;
        return instance._classeService
            .lista()
            .then(classes => {
                classes.forEach(classe =>
                    instance._listaClasses.adiciona(classe));
            });
    }

    recuperaClasse(){
        let instance = this;
        instance._whoAmIService.verifica()
            .then( whoami => {
                instance.mostraClasse(whoami);
                apontamentoController = new ApontamentoController();
            })
            .catch(error => {
                Promise.all([
                    instance.loadClasses()
                ])
                .then( () => instance._baseService.importarClasses(instance._listaClasses.classes) )
                .then( () => instance.loadClasses() )
                .then( () => instance.escolhe() )
                .catch(error => {
                    throw new Error(error);
                });
            });
    }

    iniciaInformacoesdaClasse(){
        $("#divHeaderClasse, #divTabs").hide();
    }

    populaInformacoesdaClasse(){
        $("#liTabClasse").hide();
        $("#divHeaderClasse, #divTabs").show();
    }

    escolhe(){
        let instance = this;
        $("#cmbWhoAmI").on('change', function(event){
            $("#btnGravarWhoAmI").enable( ($(this).selectpicker('val') != '') );
        });
        $("#btnGravarWhoAmI").unbind('click').on('click', function(event){
            instance._classeService.getClasseByID( $("#cmbWhoAmI").selectpicker('val') )
                .then( classe => instance._whoAmIService.cadastra( classe )
                .then( () => instance.recuperaClasse() ));
        });
    }

    mostraClasse(whoAmI){
        this._listaClasses.esvazia();

        window.classeID = whoAmI.id;

        this._listaClasses = new Bind(
            new ListaClasses().adiciona(whoAmI),
            new HeaderClassView( $('#divHeaderClasse')),
            'adiciona'
        );

        this.populaInformacoesdaClasse();
    }

}