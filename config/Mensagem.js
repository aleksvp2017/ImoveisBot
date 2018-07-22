class Mensagem{
    
    obterMensagemBoasVindas(usuario){
        return  "Olá, " + usuario + "! Para buscar imóveis digite: buscar tipo bairro. Ex: buscar ap asa norte";
    }

}

module.exports = () => {
    return new Mensagem();
}
