class WhoAmI {

    constructor(id,cd,ds,pub,per,seq) {
        this._id = id;
        this._cd = cd;
        this._ds = ds;
        this._pub = pub;
        this._per = per;
        this._seq = seq;
        Object.freeze(this); //isFrozen()
    }

    get id() {
        return this._id;
    }

    get cd() {
        return this._cd;
    }

    get ds() {
        return this._ds;
    }

    get pub() {
        return this._pub;
    }

    get per() {
        return this._per;
    }

    get seq() {
        return this._seq;
    }

}
