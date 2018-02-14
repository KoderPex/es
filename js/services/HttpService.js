class HttpService {

    _handleErrors(res) {
        if (!res.ok) throw new Error(res.statusText);
        return res;
    }

    get(url,data) {
        return fetch(url, {
                body: JSON.stringify(data),
                mode:"cors",
                cache: 'no-cache',
                headers: {
                  "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
            })
            .then(res => this._handleErrors(res))
            .then(res => res.json());
    }

    post(url, data) {
        return fetch(url, {
                headers: {'Content-type': 'application/json'},
                method: 'post',
                body: JSON.stringify(data)
            })
            .then(res => this._handleErrors(res));
    }

}
