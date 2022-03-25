const assert = require('assert')
const MongoDB = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')
const { isRegExp } = require('util/types')


const MOCK_HEROI_CADASTRAR = {
    nome: "Mulher Maravilha",
    poder: "Laço"
}
const MOCK_HEROI_DEFAULT = {
    nome: `Homem Aranha-${Date.now()}`,
    poder: "Teia"
}
const MOCK_HEROI_ATUALIZAR = {
    nome: `pATOlino-${Date.now()}`,
    poder: "Velocidade"
}

let MOCK_HEROI_ID = ''
const context = new Context(new MongoDB())
describe('MongoDB Suite de testes', function(){
    this.beforeAll(async ()=>{
        await context.connect()
        await context.create(MOCK_HEROI_DEFAULT)
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result._id;
        
    })
    it('verificar conexão', async ()=>{
        const result = await context.isConnected()
        const expected = 'Connected'

        assert.deepEqual(result, expected)
    })

    it('cadastrar', async()=>{
        const {nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async()=>{
        // pegando a primeira posicao [] e extraindo {nome, poder}:
       
        const [{nome, poder}] = await context.read({nome: MOCK_HEROI_DEFAULT.nome})
        const result = {
            nome, poder
        }
        assert.deepEqual(result, MOCK_HEROI_DEFAULT)
    })
    
    it('atualizar', async()=>{
        console.log('MOCK_HEROI_ID: ', MOCK_HEROI_ID);
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })
        assert.deepEqual(result.nModified, 1)
    })



})
