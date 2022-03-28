class BaseRoute {
    static methods(){
        /**
         * O objetivo é pegar dinamicamente os nomes, pra q a gente crie as classes.
         * Só precisa alterar as Classes e não mais o arquivo 'api.js'
         * 
         * retorna os metodos da classe pelos 'names'
         */
        return Object.getOwnPropertyNames(this.prototype)
        /**
         * depos filtra só os q não chamam 'constructor' e que não comece com _
         * _, pq se for metodo privado, não é uma rota, não é pra retornar,
         * por isso a gente faz ele começar com '_' e não é pra retornar
         *  */ 
            .filter(method => method !== 'constructor' && !method.startsWith('_'))
    }
}
module.exports = BaseRoute