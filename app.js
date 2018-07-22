if (!process.env.TOKEN){
    console.log("Por favor, configure variável de ambiente TOKEN com valor do token do telegram (obtido pelo BotFather). Ex: set TOKEN=<valor>");
    return;
}

process.env["NTBA_FIX_319"] = 1; //para tirar aviso de erro ao carregar node-telegram
var TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(process.env.TOKEN, {filepath: false, polling: true}); //filepath: false melhoria de performance sugerida pelo desenv

var consign = require('consign');
consign().include('service').include('config').into(bot);

//A cada msg de texto que siga o padrão \buscar <algumacoisa>
bot.onText(/buscar (.+)/, async (msg, match) => { 
    const chatId = msg.chat.id;
    if (!bot.config.Permissao.isUsuarioPermitido(msg.from.first_name)){
        bot.sendMessage(chatId, "Opa, você não tem permissão para usar esse bot");
        return;
    } 

    let termos = match[1];
    let paginas = await bot.service.Buscador.buscar(termos);
    if (paginas && paginas.length > 0){
        //Esse await é para garantir essa msg antes das do resultado
        await bot.sendMessage(chatId, "Encontrados " + paginas.length + " resultados para " + termos+
            ".\n Endereço utilizado para busca: " + paginas["url"]);        
        paginas.forEach(pagina => {
            bot.sendMessage(chatId, pagina);
        });
    }
    else if (!paginas){
        bot.sendMessage(chatId, "Digite pelo menos o bairro e o tipo de imóvel");
    }
    else{
        bot.sendMessage(chatId, "Nenhuma página encontrada");
    }        
});

/*bot.onText(/\/start/, (msg, match) => { 
    console.log("Começando conversa com " + msg.from.first_name);
    bot.sendMessage(msg.chat.id, bot.config.Mensagem.obterMensagemBoasVindas(msg.from.first_name));
    bot.service.Mail.enviar("aleksvp@gmail.com", "Iniciando conversa", "Iniciando conversa com  " + msg.from.first_name);
});*/

bot.onText(new RegExp(/^(?!buscar (.+))/), (msg, match) => { 
    bot.sendMessage(msg.chat.id, 
        `Para utilizar o bot digite a palavra buscar seguida das seguintes opções:\n
        -Obrigatórias:\n
          - Bairro: asa norte, lago norte, asa sul, lago sul e sudoeste;\n
          - Tipo: Valores possíveis: casa, ap / apartamento ou terreno / lote;\n
        -Opcionais:\n
          - Valor máximo. Escreva a palavra max seguido de um número qualquer;\n
          - Valor mínimo. Escreva a palavra min seguido de um número qualquer.\n
        As opções podem estar em qualquer ordem, sendo indiferente o uso de letras maiúsculas ou minúsculas.\n
        Exemplos:\n
        - buscar asa norte casa max 100000\n
        - buscar casa lago norte min 900000\n
        - buscar max 1200000 min 900000 ap asa sul`);
});


bot.on('polling_error', (error) => {
    console.log('polling_error:' + error.code);  
});  