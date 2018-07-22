class Permissoes{
    
    constructor(){
        this._usuariosPermitidos = "Aleks";
    }

    isUsuarioPermitido(usuario){
        return this._usuariosPermitidos.includes(usuario);
    } 

    listarTodosUsuariosPermitidos(){
        return this._usuariosPermitidos.split(",");
    }


}

module.exports = () => {
    return new Permissoes();
}
