const Joi = require('joi');
const BaseRoute = require('./base/baseRoute')

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
                    failAction: (request, headers, erro) => {
                        throw erro;
                    },
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
                    return "Erro interno do servidor"

                }
            }
        }
    }
}


module.exports = HeroRoutes