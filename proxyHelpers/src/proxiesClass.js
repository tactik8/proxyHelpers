
import { Proxy} from './proxyClass.js'

import { proxyProviders} from './proxyProviders.js'
export class Proxies {
    /**
     * Class to manage proxies
     * @param {Array} proxies
     * @returns {Array} proxies
     * @example
     */
    constructor(){
        this.proxies = [];
    }

    toString(activeOnly = false){
        /**
         * Get the proxies as a string
         * @returns {String} proxies
         */
        let content = ''

        let proxies = this.proxies

        if(activeOnly){
            proxies = this.getActiveProxies()
        }
        
        for(let proxy of proxies){
            content += proxy.toString() + '\n'
        }
        return content
    }


    getProxy(url){
        /**
         * Get a proxy
         * @returns {Object} proxy
         */
        return this.getActiveProxies(url)?.[0] || undefined
        
    }


    getActiveProxies(url){
        /**
         * Get a list of active proxies
         * @returns {Array} proxies
         */
        let activeProxies = this.proxies.filter(x => x.isActive(url))
        return activeProxies
    }

    
    setProxyActive(proxy, url){
        /**
         * Set a proxy as inactive
         * @returns {Object} proxy
         */

        let p = this.proxies.find(x => x.ip === proxy.ip && x.port === proxy.port)
        p.setActive(url)

        return
    }

    
    setProxyInactive(proxy, url){
        /**
         * Set a proxy as inactive
         * @returns {Object} proxy
         */

        let p = this.proxies.find(x => x.ip === proxy.ip && x.port === proxy.port)
        p.setInactive(url)

        return
    }
    
    async getProxies(){
        /**
         * Get a list of proxies
         * @returns {Array} proxies
         * @example
         * let proxies = await getProxies()
         * */
        let proxies = await proxyProviders.getAll()

        proxies = proxies.map(x => new Proxy(x))

        proxies.map(x => this.proxies.push(x))

        console.log('Proxies found: ', proxies.length)

        
    }

    async testProxies(url){
        /**
         * Test all proxies
         * @returns {Array} proxies
         * @example
         * let proxies = await testProxies()
         * */

        url = url || 'https://www.mondou.com'

        let proxies = this.proxies

        proxies = proxies.filter(x => x.status !== 'inactive')
        
        
        let x = 0
        let l = proxies.length

        
        while(x < l){
            let p = proxies.slice(x, x + 10)
            let promises = []
            for(let proxy of p){
                promises.push(proxy.test(url, true))

            }
            await Promise.all(promises)
            x += 10
        }

        
        
    }
    
}