const Joi = require('joi');
const Boom = require('@hapi/boom')
const BaseRoute = require('./base/baseRoute')
const Jwt = require('jsonwebtoken')
const failAction = (request, headers, erro) => {
    throw erro;
};


const USER = {
    username: 'xuxadasilva',
    password: '123'
}

class AuthRoutes extends BaseRoute {
    constructor(secret) {
        super()
        this.secret = secret;
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false, // desabilita auth na rota login
                tags: ['api'],
                description: 'Obter um token',
                notes: 'Faz login com user e senha do banco',
                validate: {
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })                
                }
            },
            handler: async(request) => {
                try {
                    const { username, password } = request.payload
                    if (
                        username.toLowerCase() !== USER.username.toLowerCase() ||
                        password.toLowerCase() !== USER.password.toLowerCase()
                     )
                        return Boom.unauthorized()
                    
                    const token = Jwt.sign({
                        username: username,
                        id: 1
                    }, this.secret)
                    
                    return {token}

                } catch (error) {
                    console.log('DEU RUIM: ', error);
                    return Boom.internal()

                }
            }
        }
    }

}

module.exports = AuthRoutes