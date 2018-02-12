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
    }

    updateInjectedObjects(){
        $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });
        $('select:not(.ms)').selectpicker();
        $('.bootstrap-select>.btn-default').removeClass('btn-default');
    }

}
