class ProxyFactory {

    static ehFuncao(func) {
        return typeof(func) == typeof(Function);
    }

    static create(objeto, props, acao) {

        return new Proxy(objeto, {

            get(target, prop, receiver) {
                if (props.includes(prop) && ProxyFactory.ehFuncao(target[prop])) {
                    return function() {
                        console.log(`a propriedade "${prop}" foi interceptada`);
                        let retorno = Reflect.apply(target[prop], target, arguments);
                        if (!props.includes(`-${prop}`)) {
                            acao(target);
                        }
                        return retorno;
                    }
                }
                return Reflect.get(target, prop, receiver);
            },

            set(target, prop, value, receiver) {
                let retorno = Reflect.set(target, prop, value, receiver);
                if (props.includes(prop)) {
                    acao(target);
                }
                return retorno;
            }

        });
    }
}
