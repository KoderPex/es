$(function(){

    $.fn.selectpicker.defaults = {
    	noneSelectedText: '-',
    	noneResultsText: 'Nada encontrado contendo {0}',
    	countSelectedText: 'Selecionado {0} de {1}',
    	maxOptionsText: ['Limite excedido (máx. {n} {var})', 'Limite do grupo excedido (máx. {n} {var})', ['itens', 'item']],
    	multipleSeparator: ', ',
    	deselectAllText: 'Desmarcar Todos',
    	selectAllText: 'Marcar Todos'
    };

    $.fn.visible = function(lVisible) {
    	if (lVisible) {
    		this.show();
    	} else {
    		this.hide();
    	}
    	return this;
    };
    $.fn.isEnabled = function() {
    	return this.attr( "disabled" ) == undefined || this.attr( "disabled" ).isEmpty();
    };
    $.fn.hasAttr = function(attr) {
    	return this.attr( attr ) !== undefined && !this.attr( attr ).isEmpty();
    };
    $.fn.enable = function(lEnable) {
    	if (lEnable) {
    		this.removeAttr('disabled');
    	} else {
    		this.attr('disabled','disabled');
    	}
    	return this;
    };

	window.classeID = null;
    window.maestroController = new MaestroController();
    window.apontamentoController = null;
    //$('.form').onsubmit = apontamentoController.adiciona.bind(apontamentoController);
    //$('[type=button]').onclick = apontamentoController.apaga.bind(apontamentoController);
});
