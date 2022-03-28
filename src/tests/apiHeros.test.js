const assert = require('assert')
const api = require('./../api/api')

let app = {}
describe.only('Suite de Teste Hapi', function(){
    this.beforeAll(async ()=>{
        app = await api
    })

    it('listar /herois', async ()=>{
        //injeta uma rota - simulando o usuario acessando:
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })
        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        
        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
})