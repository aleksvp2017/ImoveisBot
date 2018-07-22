class Buscador{

    constructor(app){
        this._app = app;
    }

    

    async buscar(termosABuscar) { 
        let mapa = this._app.config.ProcessadorTermos.extrairTermos(termosABuscar);

        if (!mapa["tipoImovel"] || !mapa["bairro"]){
            return null;
        }

        var options = {
            url: this._montarURL(mapa),
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
        paginas["url"] = options.url;
        return paginas;
    }

    _montarURL(mapaParametros){
        let urlBase = "https://www.wimoveis.com.br/";
        let separador = "-";
        
        let tipoImovel = mapaParametros["tipoImovel"];
        let bairro = mapaParametros["bairro"];
        let url = urlBase + tipoImovel.trim() + separador 
            + bairro.trim().replace(" ", separador);
        
        let valorMaximo = mapaParametros["valorMaximo"];
        let valorMinimo = mapaParametros["valorMinimo"];
        if (valorMaximo && valorMinimo){
            url+= separador + mapaParametros["valorMinimoEMaximo"];
        }
        else{
            if (valorMaximo){
                url += separador + valorMaximo;
            }
            if (valorMinimo){
                url += separador + valorMinimo;
            }
        }


        url += ".html";

        console.log("URL:", url);
        return url;
    }
}

module.exports = (app) => {
    return new Buscador(app);
}


