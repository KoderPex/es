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

    apoint(size,color,icon,title,type,tabindex){
        let apontamento =
            ( type == "money"
                ?
                `<div class="number">
                    <div class="input-group">
                        <div class="form-line">
                            <input type="text" class="form-control money-real text-center" placeholder="9.999,99" tabindex="${tabindex}"/>
                        </div>
                    </div>
                </div>`
                :
                `<div class="number">
                    <div class="input-group spinner" data-trigger="spinner">
                        <div class="form-line">
                            <input type="text" class="form-control text-center" value="0" data-spin="spinner" data-rule="quantity" data-min="0" data-max="999" tabindex="${tabindex}"/>
                        </div>
                        <span class="input-group-addon">
                            <a href="javascript:;" class="spin-up" data-spin="up" tabindex=-1><i class="glyphicon glyphicon-chevron-up"></i></a>
                            <a href="javascript:;" class="spin-down" data-spin="down" tabindex=-1><i class="glyphicon glyphicon-chevron-down"></i></a>
                        </span>
                    </div>
                </div>`
            );

        return `
        <div class="${size}">
            <div class="info-box-2" style="margin-bottom:10px">
                <div class="icon">
                    <i class="material-icons ${color}">${icon}</i>
                </div>
                <div class="content col-md-8">
                    <div class="text">${title}</div>
                    ${apontamento}
                </div>
            </div>
        </div>
        `;
    }

    template(model) {
        return `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.logs.map(l => {
                    return `${this.card('col-red','person',l)}`
                }).join('')}
                ${this.apoint("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12","col-green","monetization_on","Ofertas","money",1)}
                ${this.apoint("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12","col-yellow","star","Visitas","number",2)}
                ${this.apoint("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12","col-blue","public","Missão","number",3)}
                ${this.apoint("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12","col-orange","group","Relacionamento","number",4)}
                ${this.apoint("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12","col-red","account_circle","Peq. Grupo","number",5)}
                <div class="col-xl-2 col-lg-9 col-md-4 col-sm-6 col-xs-12 pull-right" id="divButtonSave">
                    <button type="button" class="btn bg-teal waves-effect">
                        <i class="material-icons">save</i>
                        <span>FECHAR APONTAMENTOS</span>
                    </button>
                </div>
            </div>
            `
           ;
    }

}
