const assert = require('assert')
const Mongodb = require('../db/strategies/mongodb')
const Context = require('../db/strategies/base/contextStrategy')
const MongoDB = require('../db/strategies/mongodb')

const context = new Context(new Mongodb())
describe('Mongodb Suite de testes', function(){
    this.beforeAll(async ()=>{
        await context.connect()
    })
    it('verificar conexão', async ()=>{
        const result = await context.isConnected()
        const expected = 'Connected'

        assert.deepEqual(result, expected)
    })
})