//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class ApontamentosListView extends View {

    constructor(elemento){ 
        super(elemento);

        elemento.on('click', function(event){
            if (event.target.nodeName == 'TH') {
                currentInstance().ordena(event.target.textContent.toLowerCase());
            }
        });
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
        return q+" <small>("+ Math.ceil((q/a)*100) +"%)</small>";
    }

    template(model) {
        return model.apontamentos.length > 0
            ? `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.apontamentos.map(n => {
                    let panel = (n.fg == '0' ? 'panel-warning' : (n.fg == '1' ? 'panel-danger' : 'panel-success' ) );
                    return `
                    <div class="panel ${panel}">
                        <div class="panel-heading" role="tab" id="headingFour_${n.id}">
                            <h4 class="panel-title">
                                <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour_${n.id}" aria-expanded="false" aria-controls="collapseFour_${n.id}">
                                    <i class="material-icons">date_range</i><div class="pull-right">Sábado ${n.sq}</div>${DateHelper.dataParaTexto(n.data)}
                                </a>
                            </h4>
                        </div>
                        <div id="collapseFour_${n.id}" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour_${n.id}" aria-expanded="false" style="height: 0px;">
                            <div class="panel-body">
                                ${this.card("col-indigo","face","MEMBROS",n.al)}
                                ${this.card("col-yellow","star","VISITANTES",n.vs)}
                                ${this.card("col-brown","pan_tool","PRESENÇA",this.palAl(15,n.al))}
                                ${this.card("col-black","book","ESTUDO",this.palAl(10,n.al))}
                                ${this.card("col-red","forum","TESTEMUNHO",n.hr)}
                                ${this.card("col-green","attach_money","OFERTA",n.vl)}
                            </div>
                        </div>
                    </div>                     
                    `
                }
                ).join('')}
            </div>
            `
            : 
            ``;
    }

}