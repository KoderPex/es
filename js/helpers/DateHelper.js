class DateHelper {

    constructor(){ //Programação defensiva
        throw new Error('DateHelper não pode ser instanciada!');
    }

    static dataParaTexto(data) {
        return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`;
    }

    static data(data) {
        return new Date(...data.split('-').map((item, indice) => item - indice % 2));
    }

    static textoParaData(texto) {
        if (!/\d{2}\/\d{2}\/\d{4}/.test(texto)) 
            throw new Error('Deve estar no formato dd/mm/aaaa');
        return new Date(...texto.split('/').reverse().map((item, indice) => item - indice % 2));
    }
    
}