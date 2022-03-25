const ICrud = require('./interfaces/interfaceCrud');
const Mongoose = require('mongoose');

const STATUS = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    4: 'Invalid Credentials',
  };

class MongoDB extends ICrud {
  constructor() {
    super()
    this._herois = null
    this._driver = null
  }

  async isConnected() {
      const state = STATUS[this._driver.readyState]
      if(state === 'Connected') return state;
      if(state !== 'Connecting') return state;
      await new Promise(resolve => setTimeout(resolve, 1000))
      return STATUS[this._driver.readyState]
  }

  defineModel() {
      const heroiSchema = new Mongoose.Schema({
        nome: {
            type: String,
            required: true
        },
        poder: {
            type: String,
            required: true
        },
        insertedAt: {
            type: Date,
            default: new Date()
        }
    })
    
    try {
      this._herois = Mongoose.model('herois')      
    } catch (error) {
      this._herois = Mongoose.model('herois', heroiSchema)      
    }
    
  }

//   conexão
  connect() {
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

    const connection = Mongoose.connection;
    this._driver = connection
    connection.once('open', () => console.log('Database rodando!'));
    this.defineModel()
  }


  create(item) {
    return this._herois.create(item)
  }
}

module.exports = MongoDB;

