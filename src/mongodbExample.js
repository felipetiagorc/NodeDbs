const Mongoose = require('mongoose')

const connectionState = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
    4: 'Invalid Credentials'
  }

Mongoose.connect('mongodb://felipe:fe2022@localhost:27017/herois', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error){
    if(!error) return;

        console.info(
      `MongoDB Connection State: ${
        connectionState[mongoose.connection.readyState]
      }`
    )
})

const connection = Mongoose.connection
connection.once('open', ()=>console.log('Database rodando!'))

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

const model = Mongoose.model('herois', heroiSchema)

async function main(){
    const resultCadastrar = await model.create({
        nome: 'Batman',
        poder: 'dinheiro'
    })
    console.log('result cadastrar', resultCadastrar)    

    const listItem = await model.find()
    console.log('itens', listItem)
}