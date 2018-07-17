process.env["NTBA_FIX_319"] = 1; //para tirar aviso de erro ao carregar node-telegram
var TelegramBot = require('node-telegram-bot-api');
const token = '644446749:AAEAycfQJos04bVm4pCott2ESYR5gSlz0z4';
//const bot = new TelegramBot(token, {polling: true});
const bot = new TelegramBot(token, {
    filepath: false, polling: true
  });


var consign = require('consign');
consign().include('service').into(bot);

var chatsNotificados = [];

bot.onText(/buscar (.+)/, async (msg, match) => { 
    const chatId = msg.chat.id;
    const termoABuscar = match[1]; 
    bot.sendMessage(chatId, "Buscando " + termoABuscar + " no portal Wimóveis pela chave ");

    let buscador = bot.service.Buscador;
    let paginas = await buscador.buscar(termoABuscar);

    if (paginas && paginas.length > 0){
        bot.sendMessage(chatId, "Encontrados " + paginas.length + " resultados");
        paginas.forEach(pagina => {bot.sendMessage(chatId, pagina)});
    }
    else{
        bot.sendMessage(chatId, "Nenhuma página encontrada");
    }       
});

bot.onText(/\/start/, async (msg, match) => { 
    bot.sendMessage(msg.chat.id, `Olá ${msg.from.first_name}, para usar o ImoveisBot, `+
    `digite buscar tipo_do_imovel cidade venda_ou_aluguel bairro. Ex: buscar casa venda lago norte brasília`);
});



bot.on('polling_error', (error) => {
    console.log('polling_error:' + error.code);  
});  