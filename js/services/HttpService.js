class HttpService {

    _handleErrors(res) {
        if (res.type === 'opaque' || res.ok) {
            return res;
        } else {
            throw new Error(res.statusText);
        }
    }

    get(url,data) {
        return fetch(url, {
                body: JSON.stringify(data),
                mode:"cors",
                cache: 'no-cache',
                headers: {"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"},
            })
            .then(res => this._handleErrors(res))
            .then(res => res.json());
    }

    post(url, data) {
        return fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(data)
            })
            .then(res => this._handleErrors(res));
    }

}
