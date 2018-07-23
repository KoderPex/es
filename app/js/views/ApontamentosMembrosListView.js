class ApontamentosMembrosListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(color,icon,l){
        return `
        <div class="col-xl-2 col-lg-4 col-md-6 col-sm-6 col-xs-12" style="margin:0px">
            <div class="info-box-2" style="margin-bottom:15px;height:125px">
                <div class="icon">
                    <i class="material-icons ${color}">${icon}</i>
                </div>
                <div class="content" style="width:100%">
                    <h4 style="color:black;height:45px">${l.nm}</h4>
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
            <label>${lbl} <input type="checkbox" membro="${l.id}" what="${w}"${chk}><span class="lever switch-col-green"></span></label>
        </div>
        `
    }

    template(model) {
        return `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.logs.filter(e => !e.ns).map(l => `${this.card('col-red','person',l)}`).join('')}
            </div>
            `
           ;
    }

}
