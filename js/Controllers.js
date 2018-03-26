class SyncController {

    constructor() {
        window._need = null;
        this._timeInterval = 0.17;
        this._pend = 0;
    }

    get pend(){
        return this._pend;
    }

    inactive(){
        clearInterval(window._need);
        window._need = null;
        console.log('Agendamento inativado!');
    }

    active(v){
        if (window._need == null) {
            let m = (this._timeInterval * 60000);
            console.log('Agendamento ativado:', (m/1000), 'segundos');
            if (!v) this.verifica();
            window._need = setInterval( () =>
                this.verifica()
                    .catch( () => console.log('Rejeitou...') )
            , m );
        }
    }

    verifica(){
        this._pend = 0;
        return new Promise( (resolve, reject) => {
            Promise.all([
                new ApontamentoService()
                    .listaSync()
                    .then( apontamentos => {
                        ++this._pend;
                    })
                //TODO: SE EXISTIR TRANSFERENCIAS, SOMAR ITENS A SINCRONIZAR.
            ])
            .then(() => {
                if (this._pend == 0){
                    this.inactive();
                    resolve();
                } else if (!window._need) {
                    this.active(true);
                }
                if (window._need !== null){
                    this.syncronize()
                        .then( () => {
                            console.log('Sincronização OK.');
                            this.inactive();
                            window.apontamentoController._screenRules();
                            resolve();
                        })
                        .catch( () => {
                            console.log('Falha.');
                            reject();
                        });
                }
            })
            .catch(() => resolve());
        })
    }

    syncronize(){
        console.log('Tentando sincronizar...');
        return new Promise( (resolve, reject) => {
            Promise.all([
                new BaseService()
                    .sendApontamentos()
                    .then( () => {
                        new ApontamentoService().truncate();
                    })
            ])
            .then( () => resolve() )
            .catch( () => reject() )
        });
    }

}

class ApontamentoController {

    constructor() {
        this._inputData = $('#data');
        this._listaApontamentos = null;
        this._service = new ApontamentoService();
        this._init();
    }

    _screenRules(){
        this._listaApontamentos = new Bind(
            new ListaApontamentos(),
            new ApontamentosListView($('#apontamentosView')),
            'adiciona'
        );
        this._service
            .lista()
            .then( apontamentos => this.atualizaListaLocal(apontamentos) )
            .catch( () => this.importaApontamentos() );
    }

    _init() {
        window.syncController
            .verifica()
            .then( () => {
                this._screenRules();
            })
            .catch( () => {
                console.log('Rejeitou...')
                this._screenRules();
            });
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

    updateApont(obj) {
        if ( obj.val() != obj.attr('old')){
            obj.attr('old',obj.val());
            let service = new ApontamentoService();
            service.recupera( obj.attr('apont') )
                .then(apontamento => {
                    let v = obj.val();
                    if (obj.attr('what') == 'vo'){
                        v = (v.replace(/[R\$ .,]/gi,'')*1)/100;
                    } else {
                        v *= 1;
                    }
                    service.update(apontamento.key, obj.attr('what'), v);
                });
        }
    }

    updateApontamento(obj) {
        let service = new LogsService();
        service.recupera( obj.attr('aluno'), window.classeID )
            .then(log => service.updateLog( log.key, obj.attr('what'), obj.prop('checked') ))
            .catch(() => service.cadastra(
                new Log(
                    obj.attr('aluno'),
                    window.classeID,
                    obj.parent().parent().parent().parent().find('h4').text(),
                    obj.attr('what') == 'pr' ? obj.prop('checked') : false,
                    obj.attr('what') == 'es' ? obj.prop('checked') : false )
            ));
    }

    updateLista(apontID) {
        BootstrapDialog.show({
            title: 'ALERTA',
            message: 'Após a confirmação, não será possível fazer alterações.<br/><br/>Confirma fechamento deste apontamento?',
            type: BootstrapDialog.TYPE_WARNING,
            size: BootstrapDialog.SIZE_SMALL,
            draggable: true,
            closable: true,
            closeByBackdrop: false,
            closeByKeyboard: false,
            buttons: [
                { label: 'N&atilde;o',
                    cssClass: 'btn-success',
                    action: function( dialogRef ){
                        dialogRef.close();
                    }
                },
                { label: 'Sim, desejo confirmar!',
                    cssClass: 'btn-danger',
                    autospin: true,
                    action: function(dialogRef){
                        dialogRef.enableButtons(false);
                        dialogRef.setClosable(false);
                        let service = new ApontamentoService();

                        service
                            .recupera( apontID )
                            .then(apontamento => {
                                new LogsService().contaPrEs(window.classeID)
                                    .then( log => {
                                        apontamento.value.es = log.es;
                                        apontamento.value.pr = log.pr;
                                        apontamento.value.fg = "1";
                                        service.updateObj(apontamento)
                                            .then( () => {
                                                window.apontamentoController._init();
                                                dialogRef.close();
                                            });
                                    });
                            });
                    }
                }
            ]
        });
    }

}

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
        let instance = this;
        instance._service
            .lista(window.classeID)
            .then(nomes => instance.atualizaListaLocal(nomes))
            .catch(error => {
                console.log(error);
                //this._mensagem.texto = error;
            });
    }

    atualizaListaLocal(nomes) {
        let instance = this;
        nomes.forEach(n => {
            instance._logsService.recupera(n.id, window.classeID)
                .then( log => instance._listaLogs.adiciona( log.value ) )
                .catch( () => instance._listaLogs.adiciona( new Log(n.id,n.ic,n.nm,false,false) ) )
        });
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
                instance.loadClasses()
                .then( () => instance.escolhe() )
                .catch( () => {
                    instance._baseService.importarClasses(instance._listaClasses.classes)
                        .then( () => this.recuperaClasse() );
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
