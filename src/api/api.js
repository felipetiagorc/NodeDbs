const Hapi = require('@hapi/hapi');
const Context = require('../db/strategies/base/contextStrategy');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema');
const HapiSwagger = require('hapi-swagger')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')
const HeroRoute = require('./../routes/heroRoutes')
const AuthRoute = require('./../routes/authRoutes')
const JWT_SECRET = 'MEU_SEGREDAO_123'
const HapiJwt = require('@hapi/jwt')


const app = new Hapi.Server({
  port: 5001,
});

//esse cara vai mapear as rotas
function mapRoutes(instance, methods) {
  /**
   * do filtro das rotas, vai vir um array: 
   * ['list','create','update']
   * 
   * * Instancia a classe, com o método mapeado, e executa ele ()
   * new HeroRoute()['list]()
   * é a mesma coisa que:
   * new HeroRoute().list()
   * só q vamos fazer dinamicamente, conforme o param passado
   
   */
  return methods.map(method => instance[method]())

}

async function main() {
  const connection = MongoDB.connect();
  const context = new Context(new MongoDB(connection, HeroiSchema));

  const swaggerOptions = {
    info: {
      title: 'API Herois - curso nodebr erickwendel',
      version: 'v1.0',
    },
    debug: true // switch on debug

  }
  const formatLogEvent = function (event) {
    console.log(`[${event.tags}], ${event.data}`);
  };

  await app.register([
    HapiJwt,
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions
    }
  ]);

  app.auth.strategy('jwt', 'jwt', {
    keys: {
      key: JWT_SECRET,
      algorithms: ['HS256']
    },
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15
  },
    // options:{
    //   expiresIn: 20
    // },
    validate: (artifacts, request, h) => {

      if (artifacts.decoded.payload.user === 'help') {
          return { response: h.redirect('https://hapi.dev/module/jwt/') }; // custom response
      }
  
      if (artifacts.decoded.payload.user === 'crash') {
          throw new Error('We hit a tree!'); // custom message in Boom.unauthorized
      }
  
      let isValid;
      if (artifacts.decoded.payload.group === 'hapi_community') {
          isValid = true;
      }
      else {
          isValid = false;
      }
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.user }
      }
    }
  })
  // aqui "intercepta"? ativa a strategy auth jwt - vai quebrar todos testes velhos
  app.auth.default('jwt')

  /** Até agora temos isso:
   * [list(), create(), read()] 
   * temos que destruturar pra não virar array de arrays, pq o route() tbm retorna array:
   *  */
  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods())
  ])

  await app.start();
  console.log('Servidor rodando na porta', app.info.port);
  app.events.on('log', formatLogEvent)
  return app;
}
module.exports = main();
