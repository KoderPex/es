//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class ApontamentosListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(color,icon,title,val){
        return `
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6" style="margin:0px">
            <div class="info-box-2" style="margin-bottom:10px">
                <div class="icon">
                    <i class="material-icons ${color}">${icon}</i>
                </div>
                <div class="content">
                    <div class="text">${title}</div>
                    <div class="number">${val}</div>
                </div>
            </div>
        </div>
        `;
    }

    palAl(q,a){
        return q+"/"+a+" <small>("+ Math.ceil((q/a)*100) +"%)</small>";
    }

    template(model) {
        return `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.apontamentos.map(n => {
                    let panel = (n.fg == '0' ? 'panel-danger' : (n.fg == '1' ? 'panel-warning' : 'panel-success' ) );
                    let icon = (n.fg == '0' ? 'create' : (n.fg == '1' ? 'cloud_queue' : 'cloud_done' ) );
                    return `
                    <div class="panel ${panel}">
                        <div class="panel-heading" role="tab" id="headingFour_${n.id}">
                            <h4 class="panel-title">
                                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour_${n.id}" aria-expanded="false" aria-controls="collapseFour_${n.id}">
                                    <i class="material-icons">date_range</i>${DateHelper.dataParaTexto(n.dt)}
                                    <div class="pull-right"><i class="material-icons">${icon}</i>&nbsp;Sábado&nbsp;${n.sq}</div>
                                </a>
                            </h4>
                        </div>
                        <div id="collapseFour_${n.id}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour_${n.id}" aria-expanded="false" style="height: 0px;">
                            <div class="panel-body">
                                ${this.card("col-indigo","face","PRESENÇA",this.palAl(15,n.mb))}
                                ${this.card("col-black","book","ESTUDO",this.palAl(n.es,n.mb))}
                                ${this.card("col-green","attach_money","OFERTA",n.vo)}
                                ${this.card("col-blue","public","MISSÃO",n.ms)}
                                ${this.card("col-orange","group","RELACIONAMENTO",n.rl)}
                                ${this.card("col-red","group_work","PEQUENO GRUPO",n.pg)}
                            </div>
                        </div>
                    </div>
                    `
                }
                ).join('')}
            </div>
            `
           ;
    }

}
