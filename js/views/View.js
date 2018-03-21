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

    updateInjectedObjects(){
        $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
        $('select:not(.ms)').selectpicker();
        $('.bootstrap-select>.btn-default').removeClass('btn-default');
        $('.panel.panel-danger').unbind('show.bs.collapse').on('show.bs.collapse', function (e) {
            window.membrosController = new MembrosController();
        });
        $('.switch>label>input').unbind('change').on('change', function (e) {
            window.apontamentoController.updateApontamento( $(this) );
        });
        $('.money-real').inputmask({alias:'real'});
        $(".spinner").spinner('changing', function(e, newVal, oldVal) {
            window.apontamentoController.updateApont($(this));
        });
        $("[apont]").on('change',function(e){
            window.apontamentoController.updateApont($(this));
        });
        $('#divButtonSave').unbind('click').on('click', function(e){
            window.apontamentoController.updateLista($(this).attr('apont-id'));
        });
        return this;
    }

}
