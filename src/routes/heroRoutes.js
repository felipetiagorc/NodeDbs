const Joi = require('joi');
const Boom = require('@hapi/boom')
const BaseRoute = require('./base/baseRoute')


const failAction = (request, headers, erro) => {
    throw erro;
};

class HeroRoutes extends BaseRoute {
    constructor(db) {
        super()
        this.db = db;
    }

    // http://localhost:5000/herois?skip=0&limit=10&nome=flash

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                validate: {
                    //payload -> body
                    //headers -> header
                    // params -> na URL :id
                    // query -> ?skip=10&limit=100
                    failAction: failAction,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(5),
                        nome: Joi.string().min(3).max(100).default('')
                    })
                }
            },
            handler: (request, headers) => {

                try {
                    const { skip, limit, nome } = request.query

                    const query = {
                        nome: {
                            $regex: `.*${nome}*.`
                        }
                    }

                    return this.db.read(nome ? query : {}, skip, limit)

                } catch (error) {
                    console.log('DEU RUIM: ', error);
                    return Boom.internal()

                }
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                validate: {
                    failAction,
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(20),
                    })
                }
            },
            handler: async (request) => {
                try {
                    const { nome, poder } = request.payload
                    const result = await this.db.create({ nome, poder })
                    return {
                        message: "Heroi cadastrado com sucesso!",
                        _id: result._id
                    }
                } catch (error) {
                    console.log('Deu ruim: ', error);
                    return Boom.internal()

                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                validate: {
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(20)
                    })
                
                }
            },
            handler: async (request)=>{
                try {
                    const {id} = request.params;
                    const payload = request.payload;
                    // pode atualizazr só nome ou só poder:

                    const dadosString = JSON.stringify(payload)
                    //aqui ele remove as chaves que não tem valor. key=undefined
                    const dados = JSON.parse(dadosString)

                    const result = await this.db.update(id, dados)
                    if(result.modifiedCount !== 1)
                        return Boom.preconditionFailed('Não foi possivel atualizar!')                     
                    return {
                        message: 'Heroi atualizado com sucesso!'
                    }
              
                    
                } catch (error) {
                    console.log('error: ', error);
                    return Boom.internal()
                    
                }
            }
        }
    }

    delete(){
        return{
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
          
                validate:{
                          failAction,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async (request) =>{
                try {
                    const {id} = request.params
                    const result  = await this.db.delete(id)
                    if(result.deletedCount !== 1) return Boom.preconditionFailed('Id nao encontrado')
                    return {
                        message: 'Herói removido com sucesso!'
                    }
                    
                } catch (error) {
                    console.log('DEU ruim: ', error);
                    return Boom.internal()
                    
                }
            }

        }
    }
}

module.exports = HeroRoutes