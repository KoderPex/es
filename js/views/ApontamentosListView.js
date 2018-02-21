//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class ApontamentosListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(size,color,icon,title,val){
        return `
        <div class="${size}" style="margin:0px">
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
                ${model.apontamentos.map(a => {
                    let panel = (a.fg == '0' ? 'panel-danger' : (a.fg == '1' ? 'panel-warning' : 'panel-success' ) );
                    let icon = (a.fg == '0' ? 'create' : (a.fg == '1' ? 'cloud_queue' : 'cloud_done' ) );

                    let content = '';
                    if (a.fg == '0') {
                        content = `<div class="panel-body" id="apontamentosNomesView"></div>`;
                    } else {
                        content = `<div class="panel-body">
                            ${this.card("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6","col-indigo","mood","Presença",this.palAl(15,a.mb))}
                            ${this.card("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6","col-black","book","Estudo",this.palAl(a.es,a.mb))}
                            ${this.card("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-6","col-green","monetization_on","Ofertas",a.vo)}
                            ${this.card("col-xl-1 col-lg-2 col-md-3 col-sm-3 col-xs-3","col-yellow","star","Visitas",a.ms)}
                            ${this.card("col-xl-1 col-lg-2 col-md-3 col-sm-3 col-xs-3","col-blue","public","Missão",a.ms)}
                            ${this.card("col-xl-1 col-lg-2 col-md-3 col-sm-3 col-xs-3","col-orange","group","Relacionamento",a.rl)}
                            ${this.card("col-xl-1 col-lg-2 col-md-3 col-sm-3 col-xs-3","col-red","account_circle","Peq. Grupo",a.pg)}
                        </div>`;
                    }
                    return `
                    <div class="panel ${panel}">
                        <div class="panel-heading" role="tab" id="headingFour_${a.id}">
                            <h4 class="panel-title">
                                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour_${a.id}" aria-expanded="false" aria-controls="collapseFour_${a.id}">
                                    <i class="material-icons">date_range</i>${DateHelper.dataParaTexto(a.dt)}
                                    <div class="pull-right"><i class="material-icons">${icon}</i>&nbsp;Sábado&nbsp;${a.sq}</div>
                                </a>
                            </h4>
                        </div>
                        <div id="collapseFour_${a.id}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour_${a.id}" aria-expanded="false" style="height: 0px;">
                            ${content}
                        </div>
                    </div>
                    `
                }).join('')}
            </div>
            `
           ;
    }

}
