process.env.TOKEN = "644446749:AAEAycfQJos04bVm4pCott2ESYR5gSlz0z4";
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
        await bot.sendMessage(chatId, "Encontrados " + paginas.length + " resultados para " + termos);        
        paginas.forEach(pagina => {
            bot.sendMessage(chatId, pagina);
        });
    }
    else if (!paginas){
        bot.sendMessage(chatId, "Digite o bairro e o tipo de imóvel");
    }
    else{
        bot.sendMessage(chatId, "Nenhuma página encontrada");
    }        
});

bot.onText(/\/start/, (msg, match) => { 
    console.log("Começando conversa com " + msg.from.first_name);
    bot.sendMessage(msg.chat.id, bot.config.Mensagem.obterMensagemBoasVindas(msg.from.first_name));
    bot.service.Mail.enviar("aleksvp@gmail.com", "Iniciando conversa", "Iniciando conversa com  " + msg.from.first_name);
});

bot.onText(new RegExp(/^(?!buscar (.+)|\/start).+/), (msg, match) => { 
    bot.sendMessage(msg.chat.id, "Para buscar, digite buscar seguido do tipo e bairro. Ex: buscar casa lago norte");
});


bot.on('polling_error', (error) => {
    console.log('polling_error:' + error.code);  
});  