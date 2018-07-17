class Buscador{

    constructor(app){
        this._app = app;
    }

    

    async buscar(termoABuscar) { 
        var options = {
            url: this._montarURL(termoABuscar),
            qs: {text: termoABuscar},
            connection: {
                rejectUnauthorized: false
            }
        };
        //Tem que usar esse request, porque o simples não funciona com async
        var request = require("request-promise");
        //Isso para quando tem https
        //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";   
        let paginas = [];     
        await request(options, async (error, response, body) => {
            if (error){
                console.log(error);
            }
            else{
                paginas = await this._app.service.ParserHTML.obterPaginas(body);
            }
        });
        return paginas;
    }

    _montarURL(termoABuscar){
        let url = "https://www.wimoveis.com.br/casas-venda-lago-norte-brasilia.html";

        return url;
    }
}

module.exports = (app) => {
    return new Buscador(app);
}


