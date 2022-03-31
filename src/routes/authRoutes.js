const Joi = require('joi');
const Boom = require('@hapi/boom')
const BaseRoute = require('./base/baseRoute')
const Jwt = require('@hapi/jwt')
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
                    
                    const token = Jwt.token.generate(
                    {
                        aud: false,
                        iss: false,
                        user: username,
                        id: 1,
                        group: 'hapi_c'
                    }, 
                    {
                        key: this.secret,
                        algorithm: 'HS512'
                    },
                    );

                    const decodedToken = Jwt.token.decode(token);
                    return {decodedToken}

                } catch (error) {
                    console.log('DEU RUIM: ', error);
                    return Boom.internal()

                }
            }
        }
    }

}

module.exports = AuthRoutes