//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class ApontamentosListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(size,color,icon,title,val){
        return `
        <div class="${size}">
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
        return q+"/"+a+" <small>("+ this.pct(q,a) +"%)</small>";
    }

    apoint(size,color,icon,title,l,w,t,i){
        let apontamento =
            ( t == "money"
                ?
                `<div class="input-group">
                    <div class="form-line">
                        <input type="text" apont="${l.id}" what="${w}" value="${l[w]}" class="form-control money-real text-center" style="font-size:20px" placeholder="0,00" tabindex="${i}"/>
                    </div>
                </div>
                `
                :
                `<div class="input-group spinner" data-trigger="spinner">
                    <div class="form-line">
                        <input type="text" apont="${l.id}" what="${w}" value="${l[w]}" class="form-control text-center" style="font-size:20px" data-spin="spinner" data-rule="quantity" data-min="0" data-max="999" tabindex="${i}"/>
                    </div>
                    <span class="input-group-addon">
                        <a href="javascript:;" class="spin-up" data-spin="up" tabindex=-1><i class="glyphicon glyphicon-chevron-up"></i></a>
                        <a href="javascript:;" class="spin-down" data-spin="down" tabindex=-1><i class="glyphicon glyphicon-chevron-down"></i></a>
                    </span>
                </div>
                `
            );

        return `
        <div class="${size}" style="margin-bottom:5px">
            <div class="info-box-2" style="margin-bottom:5px;height:120px">
                <div class="icon">
                    <i class="material-icons ${color}">${icon}</i>
                </div>
                <div class="content">
                    <div class="text" style="color:black;height:37px">${title}</div>
                    <div class="number">${apontamento}</div>
                </div>
            </div>
        </div>
        `;
    }

    pct(q,a){
        return Math.ceil((q/a)*100);
    }

    template(model) {
        return `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.apontamentos.map(a => {
                    let panel = (a.fg == '0' ? 'panel-danger' : (a.fg == '1' ? 'panel-warning' : 'panel-success' ) );
                    let icon = (a.fg == '0' ? 'create' : (a.fg == '1' ? 'cloud_queue' : 'cloud_done' ) );

                    let content = '';
                    if (a.fg == '0') {
                        content = `
                        <div class="panel-body">
                            <div class="row" id="apontamentosNomesView"></div>
                            <div class="card" style="margin-bottom:0px">
                                <h4 class="header bg-red">Resumo Geral do Dia</h4>
                            </div>
                            <div class="row">
                                ${this.apoint("col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12","col-green","monetization_on","Ofertas",a,"vo","money",1)}
                                ${this.apoint("col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12","col-yellow","star","Visitas",a,"vs","number",2)}
                                ${this.apoint("col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12","col-blue","public","Missão",a,"ms","number",3)}
                                ${this.apoint("col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12","col-orange","group","Relacionamento",a,"rl","number",4)}
                                ${this.apoint("col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12","col-red","account_circle","Peq. Grupo",a,"pg","number",5)}
                                <div class="col-xl-2 col-lg-4 col-md-4 col-sm-6 col-xs-12" id="divButtonSave" apont-id="${a.id}">
                                    <button type="button" class="btn bg-teal waves-effect" style="padding:25px 23px;">
                                        <i class="material-icons">save</i>
                                        <span>FINALIZAR APONTAMENTOS</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                       content = `<div class="panel-body">
                            ${this.card("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12","col-indigo",(this.pct(a.pr,a.mb)>75?"mood":"mood_bad"),"Presença",this.palAl(a.pr,a.mb))}
                            ${this.card("col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12","col-black","book","Estudo",this.palAl(a.es,a.mb))}
                            ${this.card("col-xl-2 col-lg-3 col-md-4 col-sm-4 col-xs-12","col-green","monetization_on","Ofertas",a.vo)}
                            ${this.card("col-xl-2 col-lg-3 col-md-3 col-sm-4 col-xs-12","col-yellow","star","Visitas",a.vs)}
                            ${this.card("col-xl-2 col-lg-3 col-md-3 col-sm-4 col-xs-12","col-blue","public","Missão",a.ms)}
                            ${this.card("col-xl-2 col-lg-3 col-md-3 col-sm-4 col-xs-12","col-orange","group","Relacionamento",a.rl)}
                            ${this.card("col-xl-2 col-lg-3 col-md-3 col-sm-4 col-xs-12","col-red","account_circle","Peq. Grupo",a.pg)}
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
