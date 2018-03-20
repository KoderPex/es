//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class ApontamentosNomesListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(color,icon,l){
        return `
        <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6" style="margin:0px">
            <div class="info-box-2" style="margin-bottom:15px;height:100px">
                <div class="icon">
                    <i class="material-icons ${color}">${icon}</i>
                </div>
                <div class="content" style="width:100%">
                    <h4 style="color:black;height:37px">${l.nm}</h4>
                    <div>
                        ${this.swt('Presença:',l,'pr')}
                        ${this.swt('Estudo:',l,'es')}
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    swt(lbl,l,w){
        let chk = l[w] ? ' checked' : '';
        return `
        <div class="switch col-sm-6" style="margin:0px;padding:0px">
            <label>${lbl} <input type="checkbox" aluno="${l.id}" what="${w}"${chk}><span class="lever switch-col-green"></span></label>
        </div>
        `
    }

    template(model) {
        return `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.logs.map(l => {
                    return `${this.card('col-red','person',l)}`
                }).join('')}
            </div>
            `
           ;
    }

}
