class WhoAmI {

    constructor(id) {
        this._id = id;
        Object.freeze(this); //isFrozen()
    }

    get id() {
        return this._id;
    }

}
