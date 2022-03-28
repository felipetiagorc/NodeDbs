const Hapi = require('@hapi/hapi');
const Context = require('../db/strategies/base/contextStrategy');
const MongoDB = require('../db/strategies/mongodb/mongodb');
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroisSchema');
const HeroRoute = require('./../routes/heroRoutes')

const app = new Hapi.Server({
  port: 5000,
});

//esse cara vai mapear as rotas
function mapRoutes(instance, methods){
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
  
//   app.route({
//     path: '/herois',
//     method: 'GET',
//     handler: (request, head) => {
//       return context.read();
//     },
//   });

    app.route([
           ])
   
  await app.start();
  console.log('Servidor rodando na porta', app.info.port);
  return app;
}
module.exports = main();
