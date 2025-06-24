import { proxyHelpers } from "./proxyHelpers/proxyHelpers.js";
import { Proxies } from "./proxyHelpers/src/proxiesClass.js";

async function test() {
    let p = new proxyHelpers.Proxies();

    await p.init();



    console.log(p.getActiveProxies().length)
    //console.log(p.toString(true));
}
test()