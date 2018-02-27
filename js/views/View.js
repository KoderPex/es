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

            $('.switch>label>input').unbind('change').on('change', function (e) {
                let service = new LogsService();
                service.recupera( $(this).attr('aluno'), window.classeID )
                    .then(log => service.updateLog( log.key, $(this).attr('what'), $(this).prop('checked') ))
                    .catch(() => service.cadastra(
                        new Log( 
                            $(this).attr('aluno'), 
                            window.classeID, 
                            $(this).parent().parent().parent().parent().find('h4').text(), 
                            $(this).attr('what') == 'pr' ? $(this).prop('checked') : false, 
                            $(this).attr('what') == 'es' ? $(this).prop('checked') : false )
                    ));
            })
        });
        return this;
    }

}
