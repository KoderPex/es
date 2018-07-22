class InputClassView extends View {

    constructor(elemento){
        super(elemento);
    }

    template(model) {
        return 
        `
        <div id="divInputDate">
            <div class="col-md-3">
                <b>Data</b>
                <div class="input-group">
                    <span class="input-group-addon">
                        <i class="material-icons">date_range</i>
                    </span>
                    <div class="form-line">
                        <input type="text" class="form-control date" placeholder="dd/mm/aaaa">
                    </div>
                </div>
            </div>
        </div>
        `
    }

}
