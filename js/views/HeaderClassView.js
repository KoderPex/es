class HeaderClassView extends View {

    constructor(elemento){
        super(elemento);
    }

    template(model) {
        return `
        <h4>Classe: ${model.classes[0].ds} (${model.classes[0].cd})</h4>
        <div>Publico: ${model.classes[0].pb} - Período: ${model.classes[0].pr}</div>
        `;
    }

}