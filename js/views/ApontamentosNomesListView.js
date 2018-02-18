//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class ApontamentosNomesListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(color,icon,title,val){
        return `
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin:0px">
            <div class="info-box-2" style="margin-bottom:5px;height:100px">
                <div class="icon">
                    <i class="material-icons ${color}">${icon}</i>
                </div>
                <div class="content">
                    <div><h4>${title}</h4></div>
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
                    <div class="switch col-sm-2">
                        <label>Presença: <input type="checkbox"><span class="lever switch-col-green"></span></label>
                    </div>
                    <div class="switch col-sm-2">
                        <label>Estudo: <input type="checkbox"><span class="lever switch-col-green"></span></label>
                    </div>
                    <div class="switch col-sm-2">
                        <label>Missão: <input type="checkbox"><span class="lever switch-col-green"></span></label>
                    </div>
                    <div class="switch col-sm-2">
                        <label>Relacionamento: <input type="checkbox"><span class="lever switch-col-green"></span></label>
                    </div>
                    <div class="switch col-sm-2">
                        <label>Pequeno Grupo: <input type="checkbox"><span class="lever switch-col-green"></span></label>
                    </div>
                    `
                    return `
                    ${this.card('col-red','person',a._nm,switchs)}
                    `
                }).join('')}
            </div>
            `
           ;
    }

}
