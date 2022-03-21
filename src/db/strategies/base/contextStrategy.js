const ICrud = require('./../interfaces/interfaceCrud')

class ContextStrategy extends ICrud {
    constructor(strategy){
        super()
        this._database = strategy
    }

    // aqui criamos a classe concreta que implementa os métodos, de acordo, com  a strategy definida
    // se o mongoDB não tiver implementado o 'create', nesse momento, ele vai tenta usar o ICrud e vai dar problema..
    create(item){
        return this._database.create(item)
    }

    read(item){
        return this._database.read(item)
    }

    update(id, item){
        return this._database.update(id, item)
    }

    delete(id){
        return this._database.delete(id)
    }

    isConnected(){
        return this._database.isConnected()
    }
    connect(){
        return this._database.connect()
    }
}

module.exports = ContextStrategy