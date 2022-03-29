const assert = require('assert')
const api = require('./../api/api')

let app = {}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Mira'
}


let MOCK_ID = ''
describe.only('Suite de Teste Hapi', function(){
    this.beforeAll(async ()=>{
        app = await api
        const result = await app.inject({
            method: 'POST',
            url: '/herois',
            payload: JSON.stringify(MOCK_HEROI_INICIAL)
        })
        const dados = JSON.parse(result.payload)
        MOCK_ID = dados._id
    })

    it('listar /herois', async ()=>{
        //injeta uma rota - simulando o usuario acessando:
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /herois - deve retornar so 5 registros', async ()=>{
        const TAMANHO_LIMITE = 5
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const dados = JSON.parse(result.payload) 
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados.length === TAMANHO_LIMITE)
    })

    it.skip('listar /herois - deve retornar texto com limit incorreto', async ()=>{
        const TAMANHO_LIMITE = 'AEEE'
        const result = await app.inject({        
            method: 'GET',
            url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`
        })

        const erroResult = {
            "statusCode":400,
            "error":"Bad Request",
            "message":"\"limit\" must be a number",
            "validation":{
                "source":"query",
                "keys":["limit"]
            }
        }

        assert.deepEqual(result.statusCode, 400)
        assert.deepEqual(result.payload, erroResult)

    })

    it.skip('listar /herois - deve filtrar um item', async ()=>{
        const NAME = 'Homem Aranha-1648228569642'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=1000&nome=${NAME}`
        })

        const dados = JSON.parse(result.payload) 
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.deepEqual(dados[0].nome, NAME)
    })
    it('cadastrar POST - /herois', async()=>{
        const result = await app.inject({
            method: 'POST',
            url: `/herois`,
            payload: MOCK_HEROI_CADASTRAR 
        })

    
        const statusCode = result.statusCode
        
        const {message, _id} = JSON.parse(result.payload)
        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepEqual(message, "Heroi cadastrado com sucesso!")
    })
    it('atualizar Patch - /herois/:id', async()=>{
        const _id = MOCK_ID
        const expected = {
            poder: 'Super Mira'
        }
      
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(expected)
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, "Heroi atualizado com sucesso!")
    })

})