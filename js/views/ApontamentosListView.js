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

    template(model) {
        return model.apontamentos.length > 0
            ? `
            <div class="panel-group" id="accordion_17" role="tablist" aria-multiselectable="true">
                <div class="panel panel-col-orange">
                    <div class="panel-heading" role="tab" id="headingFour_17">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion_17" href="#collapseFour_17" aria-expanded="false" aria-controls="collapseFour_17">
                                <i class="material-icons">folder_shared</i> Collapsible Group Item
                                #4
                            </a>
                        </h4>
                    </div>
                    <div id="collapseFour_17" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFour_17" aria-expanded="false" style="height: 0px;">
                        <div class="panel-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,
                            non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
                            eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                            single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                            helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                            Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table,
                            raw denim aesthetic synth nesciunt you probably haven't heard of them
                            accusamus labore sustainable VHS.
                        </div>
                    </div>
                </div>
                <div class="panel panel-col-teal">
                    <div class="panel-heading" role="tab" id="headingThree_17">
                        <h4 class="panel-title">
                            <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion_17" href="#collapseThree_17" aria-expanded="false" aria-controls="collapseThree_17">
                                <i class="material-icons">contact_phone</i> Collapsible Group Item
                                #3
                            </a>
                        </h4>
                    </div>
                    <div id="collapseThree_17" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingThree_17">
                        <div class="panel-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute,
                            non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum
                            eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
                            single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh
                            helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                            Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table,
                            raw denim aesthetic synth nesciunt you probably haven't heard of them
                            accusamus labore sustainable VHS.
                        </div>
                    </div>
                </div>
            </div>





            <table class="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>DATA</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    ${model.apontamentos.map(n => `
                        <tr>
                            <td class="text-center">${DateHelper.dataParaTexto(n.data)}</td>
                            <td class="text-center">ICON</td>
                        </tr>                        
                    `).join('')}
                </tbody>
            </table>`
            : ``;
    }

    /*

    */

}