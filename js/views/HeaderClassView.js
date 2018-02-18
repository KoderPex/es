class HeaderClassView extends View {

    constructor(elemento){
        super(elemento);
    }

    template(model) {
        return `
        <h4>${("00"+model.classes[0].sq).slice(-2)}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;${model.classes[0].ds} (${model.classes[0].cd})&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;${model.classes[0].pb}&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;${model.classes[0].pr} PERÍODO</h4>
        `;
    }

}
