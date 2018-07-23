class MembrosListView extends View {

    constructor(elemento){
        super(elemento);
    }

    card(color,l){
        const buttonContent = l.ns 
            ? `<button type="button" class="btn btn-success pull-right" membro-transf='{"id":${l.id},"ns":${l.ns}}' style="width:140px;"><i class="material-icons">mood</i><span>RECEBER</span></button>`
            : `<button type="button" class="btn btn-danger pull-right" membro-transf='{"id":${l.id},"ns":${l.ns}}' style="width:140px;"><i class="material-icons">mood_bad</i><span>TRANSFERIR</span></button>`;
        return `
        <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12" style="margin:0px;margin-bottom:-20px">
            <div class="info-box-2">
                <div class="icon">
                    <i class="material-icons ${color}">person</i>
                </div>
                <div class="content" style="width:100%">
                    <h4 style="color:black">
                        <label>${l.nm}</label>
                        ${buttonContent}
                    </h4>
                </div>
            </div>
        </div>
        `;
    }

    template(model) {
        return `
            <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                ${model.membros.map(l => `${this.card( (l.ns ? 'col-green' : 'col-red') ,l)}`).join('')}
            </div>
            `
           ;
    }

}
