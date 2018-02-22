//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class ApontamentosNomesListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(color,icon,title,val){
        return `
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin:0px">
            <div class="info-box-2" style="margin-bottom:15px">
                <div class="icon">
                    <i class="material-icons ${color}">${icon}</i>
                </div>
                <div class="content" style="width:100%">
                    <div><h5>${title}</h5></div>
                    <div>${val}</div>
                </div>
            </div>
        </div>
        `;
    }

    template(model) {
        return `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.nomes.map(a => {
                    let switchs = `
                    <div class="switch col-sm-6" style="margin:0px;padding:0px">
                        <label>Presença: <input type="checkbox"><span class="lever switch-col-green"></span></label>
                    </div>
                    <div class="switch col-sm-6" style="margin:0px;padding:0px">
                        <label>Estudo: <input type="checkbox"><span class="lever switch-col-green"></span></label>
                    </div>
                    `
                    return `
                    ${this.card('col-red','person',a._nm,switchs)}
                    `
                }).join('')}
                <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <button type="button" class="btn bg-orange waves-effect">
                        <i class="material-icons">save</i>
                        <span>FECHAR APONTAMENTOS</span>
                    </button>
                </div>
            </div>
            `
           ;
    }

}
