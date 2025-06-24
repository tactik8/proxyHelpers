import { proxyHelpers } from "./proxyHelpers/proxyHelpers.js";

async function test() {
    let p = new proxyHelpers.Proxies();

    await p.getProxies();


    await p.testProxies()
    
    console.log(p.toString(true));
}
test()