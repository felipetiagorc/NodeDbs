const assert = require('assert')
const Postgres = require('../db/strategies/postgres')
const Context = require('../db/strategies/base/contextStrategy')

const context = new Context(new Postgres())
const MOCK_HEROI_CADASTRAR = {nome: 'Gaviao Negro', poder: 'flexas'}
const MOCK_HEROI_ATUALIZAR = {nome: 'Batma', poder: 'dinheiro'}


describe('Postgres Strategy', function(){
    this.timeout(Infinity);
    this.beforeAll(async function(){
        await context.connect()
        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)

    })
    it('PostgresSQL Connection', async function(){
        const result = await context.isConnected()
        assert.equal(result, true)
    })
    it('Cadastrar', async function(){
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Listar', async function (){
        const result = await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
        //pegar primeira posicao
        const posicaoZero = result[0];
        delete posicaoZero.id
        assert.deepEqual(posicaoZero, MOCK_HEROI_CADASTRAR)
    })
    it('Atualizar', async function(){
        const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha' 
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        assert.deepEqual(result, 1)
    })
    it('Remover', async function(){
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)
    })

})