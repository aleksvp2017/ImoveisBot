class ProcessadorTermos
{
    extrairTermos(chave){
        let bairrosExp = [/lago norte/i, /asa norte/i, /asa sul/i, /lago sul/i, /sudoeste/];
        let bairrosNomes = ["lago-norte-brasilia", "asa-norte-brasilia", "asa-sul-brasilia",
            "lago-sul-brasilia", "sudoeste-brasilia"];
        let tiposImovelExp = [/casa/i, /ap/i, /terreno/i, /lote/i];
        let tiposImovelNome = ["casas", "apartamentos", "terrenos", "terrenos"];
        let valorMaximoExp = /maximo \d+/i;
        let valorMaximoNome = "menos-#valor-reales";
        let valorMinimoExp = /minimo \d+/i;
        let valorMinimoNome = "mais-#valor-reales";
        let valorMinimoEMaximoNome = "#minimo-#maximo-reales";


        let mapa = [];
        let indice = 0;
        bairrosExp.forEach((bairroExp) => {
            let pos = chave.search(bairroExp);
            if (pos >= 0){
                mapa["bairro"] = bairrosNomes[indice];
            }
            indice ++;
        });

        indice = 0;
        tiposImovelExp.forEach((tipoImovelExp) => {
            let pos = chave.search(tipoImovelExp);
            if (pos >= 0){
                mapa["tipoImovel"] = tiposImovelNome[indice];
            }
            indice ++;
        });

        var expressaoRegular = new RegExp(valorMaximoExp);
        var resultado = expressaoRegular.exec(chave);
        let maximo = 0;
        if (resultado){
            maximo = resultado[0].replace("maximo","").trim();
            mapa["valorMaximo"] = valorMaximoNome.replace("#valor", maximo);
        };

        expressaoRegular = new RegExp(valorMinimoExp);
        resultado = expressaoRegular.exec(chave);
        let minimo = 0;
        if (resultado){
            minimo = resultado[0].replace("minimo","").trim();
            mapa["valorMinimo"] = valorMinimoNome.replace("#valor", minimo);
        };

        if (mapa["valorMaximo"] && mapa["valorMinimo"]){
            mapa["valorMinimoEMaximo"] = valorMinimoEMaximoNome.replace("#minimo", minimo).
                replace("#maximo", maximo).trim();
        }
        
        return mapa;
    }
    

    
}

module.exports = () => {
    return new ProcessadorTermos();
}