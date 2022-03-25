const ICrud = require('../interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const STATUS = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    4: 'Invalid Credentials',
  };

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super()
    this._schema = schema
    this._connection = connection
  }

  async isConnected() {
      const state = STATUS[this._connection.readyState]
      if(state === 'Connected') return state;
      if(state !== 'Connecting') return state;
      await new Promise(resolve => setTimeout(resolve, 1000))
      return STATUS[this._connection.readyState]
  }
/**
 * quem for trabalhar com o conect, 
 * nao vai usar os membros da classe 'this'
 * ele vai conectar e retornar a 'conexão', 
 * pra que outras claasses trabalhem a partir dela
 * 
 * transformou o connect() em static connect() 
 * e tirou os 'this.connection'
 *  */ 

  static connect() {
    Mongoose.connect(
      'mongodb://felipe:fe2022@localhost:27017/herois',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (error) {
        if (!error) return;

        console.info(
          `MongoDB Connection State: ${
            STATUS[mongoose.connection.readyState]
          }`
        );
      }
    );

    const connection = Mongoose.connection
    connection.once('open', () => console.log('Database rodando!'));
    return connection
  }


  create(item) {
    return this._schema.create(item)
  }

  read(item, skip=0, limit=10){
    return this._schema.find(item).skip(skip).limit(limit)
  }
  update(id, item){
    return this._schema.updateOne({_id: id}, {$set: item})
  }

  delete(id){
    return this._schema.deleteOne({_id:id})
    //retornar um 'deleteResult'
  }

}

module.exports = MongoDB;

