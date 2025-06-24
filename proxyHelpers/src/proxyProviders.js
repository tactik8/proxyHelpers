

export const proxyProviders ={

    getAll: getAll,
    providers: ['Proxyscrape'],
    'Proxyscrape': getProxiesProxyscrape,
    
}

async function getAll(){
    /**
     * Get a list of proxies
     *
     *     
     */

    let proxies = []

    for(let provider of proxyProviders.providers){
        let p = await proxyProviders[provider]()
        proxies = proxies.concat(p)    
    }
    return proxies
}


export async function getProxiesProxyscrape() {
    /**
     * Get a list of proxies
     * @returns {Array} proxies
     * @example
     * let proxies = await getProxies()
     */

    let proxyUrl =
        "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=5000&country=CA&ssl=all&anonymity=all";

    let domain = new URL(proxyUrl).hostname;

    let response = await fetch(proxyUrl);
    let proxyList = await response.text();

    proxyList = proxyList.replace(/\r/g, "");
    let formattedProxyList = proxyList.split("\n");

    let proxies = [];
    for (let p of formattedProxyList) {
        let proxy = {
            "@type": "Proxy",
            ip: p.split(":")[0],
            port: p.split(":")[1],
            source: domain,
        };
        proxies.push(proxy);
    }

    return proxies;
}
