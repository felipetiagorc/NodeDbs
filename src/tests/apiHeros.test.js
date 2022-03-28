const assert = require('assert')
const api = require('./../api/api')

let app = {}
describe('Suite de Teste Hapi', function(){
    this.beforeAll(async ()=>{
        app = await api
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

    it('listar /herois - deve retornar texto com limit incorreto', async ()=>{
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

    it('listar /herois - deve filtrar um item', async ()=>{
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
})