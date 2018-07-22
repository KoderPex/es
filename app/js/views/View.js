class View {

    constructor(elemento) {
        this._elemento = elemento;
        Object.freeze(this);
    }

    template() {
        throw new Error('O método template deve ser implementado');
    }

    update(model) {
        this._elemento.html(this.template(model));
        this.updateInjectedObjects();
        return this;
    }

    comboClasses() {
        return window.maestroController.classes()
            .filter(e => e.id !== window.whoAmI.id)
            .map(n => `<option data-subtext="(${n.pb} | ${n.pr} PERÍODO | ${n.cd})" value="${n.id}">CLASSE ${("00"+n.sq).slice(-2)} - ${n.ds}</option>`).join('')
    }

    updateInjectedObjects(){
        $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
        $('select:not(.ms)').selectpicker();
        $('.bootstrap-select>.btn-default').removeClass('btn-default');
        $('.panel.panel-danger').unbind('show.bs.collapse').on('show.bs.collapse', function (e) {
            window.membrosController = new MembrosController();
        });
        $("[membro-transf]").unbind('click').on('click', function(e){
            window.membrosController.transfereMembro( { ...JSON.parse($(this).attr('membro-transf')), nm: $(this).parent().find("label").text() } );
        });
        $('.switch>label>input').unbind('change').on('change', function (e) {
            window.apontamentosController.updateApontamento( $(this) );
        });
        $('.money-real').inputmask({alias:'real'});
        $(".spinner").spinner('changing', function(e, newVal, oldVal) {
            window.apontamentosController.updateApont($(this));
        });
        $("[apont]").on('change',function(e){
            window.apontamentosController.updateApont($(this));
        });
        $('#divButtonSave').unbind('click').on('click', function(e){
            window.apontamentosController.updateLista($(this).attr('apont-id'));
        });
        return this;
    }

}
