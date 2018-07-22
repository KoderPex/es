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
            window._need = setInterval(() =>
                this.verifica()
                    .then(() => window.apontamentosController._screenRules())
                    .catch(() => console.log('Rejeitou...'))
            ,m);
        }
    }

    verifica(){
        this._pend = 0;
        return new Promise( (resolve, reject) => {
            Promise.all([
                new ApontamentosService()
                    .listaSync()
                    .then(() => ++this._pend)
                    .catch(() => this.pend),
                new LogsService()
                    .lista()
                    .then(() => ++this._pend)
                    .catch(() => this.pend)
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
                        .then(() => {
                            console.log('Sincronização OK.');
                            this.inactive();
                            resolve();
                        })
                        .catch(() => {
                            console.log('Falha.');
                            reject();
                        });
                }
            })
            .catch(() => this._pend > 0 ? reject() : resolve());
        })
    }

    syncronize(){
        console.log('Tentando sincronizar...');
        return new Promise( (resolve, reject) => {
            new BaseService()
                .sendTransferencias()
                .then(() => {
                    new ApontamentosService().truncate();
                    new LogsService().truncate();
                    resolve();
                })
                .catch( () => reject() )
            });
    }

}

class ApontamentosController {

    constructor() {
        this._inputData = $('#data');
        this._listaApontamentos = null;
        this._service = new ApontamentosService();
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
            .then(apontamentos => this.atualizaListaLocal(apontamentos))
            .catch(() => this.importaApontamentos());
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
    }

    insertApontamento(apontamento) {
        this._service
            .cadastra(apontamento)
            .then(() => {
                this._listaApontamentos.adiciona(apontamento);
                this._limpaFormulario();
            });
    }

    importaApontamentos() {
        new BaseService()
            .importarApontamentos(this._listaApontamentos.apontamentos)
            .then(apontamentos => this.atualizaListaLocal(apontamentos));
    }

    atualizaListaLocal(apontamentos) {
        const lista = apontamentos.forEach(apontamento =>
            this._listaApontamentos.adiciona(apontamento));
        return lista;
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
            .then(mensagem => this._listaApontamentos.esvazia());
    }

    updateApont(obj) {
        if (obj.val() != obj.attr('old')){
            obj.attr('old',obj.val());
            let service = new ApontamentosService();
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

    updateTransf(obj) {
        let service = new LogsService();
        return service.recupera( obj.id, window.whoAmI.id )
            .then(log => service.updateLog(log.key, 'ns', false))
            .catch(() => service.cadastra(
                new Log(
                    null,
                    window.whoAmI.id,
                    obj.id,
                    obj.nm,
                    false,
                    false )
            ));
    }

    updateApontamento(obj) {
        let service = new LogsService();
        service.recupera(obj.attr('membro'), window.whoAmI.id)
            .then(log => service.updateLog(log.key, obj.attr('what'), obj.prop('checked') ))
            .catch(() => service.cadastra(
                new Log(
                    null,
                    window.whoAmI.id,
                    obj.attr('membro'),
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
                        let service = new ApontamentosService();

                        service
                            .recupera( apontID )
                            .then(apontamento => {
                                new LogsService().contaPrEs(window.whoAmI.id)
                                    .then( log => {
                                        apontamento.value.es = log.es;
                                        apontamento.value.pr = log.pr;
                                        apontamento.value.fg = "1";
                                        service.updateObj(apontamento)
                                            .then( () => {
                                                window.apontamentosController._init();
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
            new ApontamentosMembrosListView($('#apontamentosMembrosView')),
            'adiciona'
        );

        this._service = new MembrosService();
        this._logsService = new LogsService();

        this._init();
    }

    _init() {
        let instance = this;
        instance._service
            .lista(window.whoAmI.id)
            .then(membros => instance.atualizaListaLocal(membros))
            .catch(error => console.log(error));
    }

    _atualizaSpanPlus() {
        const names = window.maestroController._listaMembros.membros.filter((e,i,a) => e._ns === true);
        $("#spanPlus").text(`${names.length}`).visible(names.length>0);
    }

    atualizaListaLocal(membros) {
        let instance = this;
        membros.filter((e,i,a) => e._ns !== true).forEach(n => {
            instance._logsService.recupera(n.id, window.whoAmI.id)
                .then(log => instance._listaLogs.adiciona(log.value))
                .catch(() => instance._listaLogs.adiciona(
                    new Log(
                        null,
                        n.ic,
                        n.id,
                        n.nm,
                        false,
                        false
                    ))
                )
        });
    }

    transfereMembro(obj) {
        if (obj.ns){
            // window.apontamentosController.updateTransf(obj)
            // .then(() => this._service.aceitarTransferencia(obj.id))
            // .then(() => {
            //     window.maestroController._listaMembros.esvazia();
            //     return window.maestroController.recuperaMembros(window.whoAmI)
            // })
            // .then(() => {
            //     window.membrosController = new MembrosController();
            // });
            return;
        }
        BootstrapDialog.show({
            title: 'ALERTA',
            message: dialogRef => {
                var $message = $(`<p>Confirma transferência de <b>${obj.nm}</b> para a sala abaixo indicada?</p>`);
                var $select = 
                $(`<select id="cmbClassID" class="form-control show-tick" data-live-search="true" data-show-subtext="true" tabindex="-98">
                    <option></option>
                    ${new View().comboClasses()}
                </select>`);
                $message.append($select);
                return $message;
            },
            onshown: () => $("#cmbClassID").selectpicker(),
            type: BootstrapDialog.TYPE_DANGER,
            size: BootstrapDialog.SIZE_NORMAL,
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
                        let service = new ApontamentosService();

                        service
                            .recupera( apontID )
                            .then(apontamento => {
                                new LogsService().contaPrEs(window.whoAmI.id)
                                    .then( log => {
                                        apontamento.value.es = log.es;
                                        apontamento.value.pr = log.pr;
                                        apontamento.value.fg = "1";
                                        service.updateObj(apontamento)
                                            .then( () => {
                                                window.apontamentosController._init();
                                                dialogRef.close();
                                            });
                                    });
                            });
                    }
                }
            ]
        });
    };

}

class MaestroController {

    constructor() {
        this._listaClasses = new Bind(
            new ListaClasses(),
            new InputClassView($('#inputClasseView')),
            'adiciona','esvazia'
        );

        this._listaMembros = new Bind(
            new ListaMembros(),
            new MembrosListView($('#membrosView')),
            'adiciona'
        );
        this._classesService = new ClassesService();
        this._whoAmIService = new WhoAmIService();
        this._baseService = new BaseService();
        this._membrosService = new MembrosService();
        this._init();
    }

    _init() {
        Promise.all([
            this.iniciaInformacoesdaClasse()
        ])
        .then(() => this.recuperaClasses());
    }

    classes() {
        return this._listaClasses.classes;
    }

    loadClasses() {
        let instance = this;
        return instance._classesService
            .lista()
            .then(classes => 
                classes.forEach(classe =>
                    instance._listaClasses.adiciona(classe))
            );
    }

    recuperaMembros(whoAmI) {
        let instance = this;
        return instance._membrosService
            .lista(whoAmI.id)
            .then(membros => {
                const fieldSorter = (fields) => (a, b) => fields.map(o => {
                    let dir = 1;
                    if (o[0] === '-') { dir = -1; o=o.substring(1); }
                    return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
                }).reduce((p, n) => p ? p : n, 0);
                membros.sort(fieldSorter(['-ns','nm'])).forEach(n => instance._listaMembros.adiciona( n ));
                window.membrosController._atualizaSpanPlus();
            });
    }

    recuperaClasses(loadClasse = true){
        let instance = this;
        instance._whoAmIService.verifica()
            .then(whoami => {
                instance.recuperaMembros(whoami);
                instance.mostraClasse(whoami);
                if (loadClasse) instance.loadClasses();
                window.apontamentosController = new ApontamentosController();
            })
            .catch(error => {
                instance.loadClasses()
                    .then(() => instance.escolhe())
                    .catch(() => {
                        instance._baseService.importarMembros(instance._listaMembros.membros)
                        instance._baseService.importarClasses(instance._listaClasses.classes)
                            .then(() => this.recuperaClasses(false));
                    });
            });
    }

    iniciaInformacoesdaClasse(){
        $("#divHeaderClasse, #divTabs").hide();
    }

    populaInformacoesdaClasse(){
        $("#liTabClasse").hide();
        $("#divHeaderClasse, #divTabs").show();
        $('#inputClasseView').hide();
    }

    escolhe(){
        let instance = this;
        $("#cmbWhoAmI").on('change', function(event){
            $("#btnGravarWhoAmI").enable( ($(this).selectpicker('val') != '') );
        });
        $("#btnGravarWhoAmI").unbind('click').on('click', function(event){
            instance._classesService.getClasseByID( $("#cmbWhoAmI").selectpicker('val') )
                .then( classe =>
                    instance._whoAmIService.cadastra( classe )
                        .then(() => instance.recuperaClasses(false)));
        });
    }

    mostraClasse(whoAmI){
        window.whoAmI = whoAmI;

        this._header = new Bind(
            new ListaClasses().adiciona(whoAmI),
            new HeaderClassView( $('#divHeaderClasse')),
            'adiciona'
        );

        window.membrosController = new MembrosController();

        this.populaInformacoesdaClasse();
    }

}
