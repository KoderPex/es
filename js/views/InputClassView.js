//import {View} from './View';
//import {DateHelper} from '../helpers/DateHelper';
//import {currentInstance} from '../controllers/ApontamentoController';

class InputClassView extends View {

    constructor(elemento){
        super(elemento);
    }

    template(model) {
        return `
            <div class="col-md-12">
                <div class="form-group">
                    <div class="form-line">
                        <p>
                            <b>Escolha abaixo a Classe para este dispositivo</b>
                        </p>
                        <select id="cmbWhoAmI" class="form-control show-tick" data-live-search="true" data-show-subtext="true" tabindex="-98">
                            <option></option>
                            ${model.classes.map(n => {
                                return `
                                <option data-subtext="(CLASSE ${("00"+n.seq).slice(-2)} | ${n.pub} | ${n.per} PERÍODO | ${n.cd})" value="${n.id}">${n.ds}</option>
                                `
                            }
                            ).join('')}
                        </select>
                    </div>
                </div>
                <button type="button" id="btnGravarWhoAmI" class="btn bg-orange waves-effect">
                    <i class="material-icons">save</i>
                    <span>CONFIRMAR CLASSE</span>
                </button>
            </div>
        `;
    }

}
