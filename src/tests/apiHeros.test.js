const assert = require('assert')
const api = require('./../api/api')

let app = {}
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inh1eGFkYXNpbHZhIiwiaWQiOjEsImlhdCI6MTY0ODY5MjAyNn0.JTpMW-EOgyLU8yXj1EmEKL2kFhLNFoK2gW779Z_bIvs'

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}
const MOCK_HEROI_INICIAL = {
    nome: 'Gavião Negro',
    poder: 'Mira'
}


let MOCK_ID = ''
describe('Suite de Teste Hapi', function(){
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
        
        console.log('result: ', result);

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
        const NAME = MOCK_HEROI_INICIAL.nome
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

    it('atualizar Patch - /herois/:id - não deve atualizar com id errado', async()=>{
        //pegamos um id válido, mas que nao vai ser encontrado:
         const _id = `6243bda60409fd46a19ece00` 
     
        const result = await app.inject({
            method: 'PATCH',
            url: `/herois/${_id}`,
            payload: JSON.stringify(
                {poder: 'Super Mira'}
            )
        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Não foi possivel atualizar!'
          }

        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })
    it('remover DELETE - /herois/:id', async()=>{
        const _id = MOCK_ID
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`

        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepEqual(dados.message, 'Herói removido com sucesso!' )
    })

    it('remover DELETE - /herois/:id - não deve remover sem id', async()=>{
         //pegamos um id válido, mas que nao vai ser encontrado:
        const _id = `6243bda60409fd46a19ece00` 
        const result = await app.inject({
            method: 'DELETE',
            url: `/herois/${_id}`

        })
        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id nao encontrado'
          }

        assert.ok(statusCode === 412)
        assert.deepEqual(dados, expected)
    })

    it('remover DELETE - /herois/:id - não deve remover com id invalido', async()=>{
        //pegamos um id válido, mas que nao vai ser encontrado:
       const _id = 'ID_INVALIDO' 
       const result = await app.inject({
           method: 'DELETE',
           url: `/herois/${_id}`

       })
       const statusCode = result.statusCode
       const dados = JSON.parse(result.payload)

       const expected = {
           statusCode: 500,
           error: "Internal Server Error",
           message: "An internal server error occurred"
         }

       assert.ok(statusCode === 500)
       assert.deepEqual(dados, expected)
   })




})