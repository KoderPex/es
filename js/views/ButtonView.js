//import {View} from './View';
//import {currentInstance} from '../controllers/ApontamentoController';

class ButtonView extends View {

    constructor(elemento){
        super(elemento);

        elemento.on('click', function(event){
            if (event.target.nodeName == 'BUTTON') {
                currentInstance().atualizaButtons( this.template() );
            }
        });
    }

    template() {
        return `
            <button type="button" class="btn btn-success waves-effect">
                <i class="material-icons">control_point</i>
                <span>Novo</span>
            </button>
            `;
    }

}
