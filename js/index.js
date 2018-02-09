$(function(){
    $('.date').inputmask('dd/mm/yyyy', { placeholder: '__/__/____' });

    let apontamentoController = new ApontamentoController();
    
    $('.form').onsubmit = apontamentoController.adiciona.bind(apontamentoController);
    $('[type=button]').onclick = apontamentoController.apaga.bind(apontamentoController);
});