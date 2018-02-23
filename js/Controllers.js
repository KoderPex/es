//import {apontamento} from '../models/apontamento';
//import {ListaApontamentos} from '../models/ListaApontamentos';
//import {Mensagem} from '../models/Mensagem';
//import {ApontamentosView} from '../views/ApontamentosView';
//import {MensagemView} from '../views/MensagemView';
//import {ApontamentoService} from '../services/ApontamentoService';
//import {Bind} from '../helpers/Bind';

class MembrosController {

    constructor() {
        this._listaLogs = new Bind(
            new ListaLogs(),
            new ApontamentosNomesListView($('#apontamentosNomesView')),
            'adiciona'
        );

        this._service = new NomesService();
        this._logsService = new LogsService();

        this._init();
    }

    _init() {
        this._service
            .lista(window.classeID)
            .then(nomes => this.atualizaListaLocal(nomes))
            .catch(error => {
                console.log(error);
                //this._mensagem.texto = error;
            });
    }

    atualizaListaLocal(nomes) {
        let instance = this;
        return nomes.forEach(n => 
            instance._logsService.recupera(n.id, window.classeID)
                .then( log => instance._listaLogs.adiciona( log.value ) )
                .catch( () => instance._listaLogs.adiciona( new Log(n.id,n.ic,n.nm,false,false) ) )
        );
    }

}

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
        this._nomesService = new NomesService();
        this._init();
    }

    _init() {
        Promise.all([
            this.iniciaInformacoesdaClasse()
        ])
        .then( () => this.recuperaClasse() );

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

    recuperaNomes(whoami) {
        let instance = this;
        instance._nomesService.lista(whoami._id)
            .catch(error => {
                Promise.all([
                    this._baseService.importarAlunos()
                ])
                .catch(error => {
                    throw new Error(error);
                });
            });
    }

    recuperaClasse(){
        let instance = this;
        instance._whoAmIService.verifica()
            .then( whoami => {
                instance.recuperaNomes(whoami);
                instance.mostraClasse(whoami);
                window.apontamentoController = new ApontamentoController();
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
                .then( classe =>
                    instance._whoAmIService.cadastra( classe )
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
        return new Apontamento(
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