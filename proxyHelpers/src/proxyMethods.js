//const { HttpsProxyAgent } = require('https-proxy-agent');

import { HttpsProxyAgent } from 'https-proxy-agent';


export async function testProxy(proxy, url) {
    /**
     * Test a proxy
     * @param {Object} proxy
     * @returns {Object} proxy
     *
     */

    url = url || "https://www.google.com";

    let action = {
        "@type": "Action",
        "@id": "testProxy",
        name: "Test Proxy",
        description: "Test a proxy",
        instrument: {
            "@type": "WebSite",
            url: url,
        },
        object: proxy,
        startTime: new Date(),
    };

    let proxyIP = proxy?.ip;
    let proxyPort = proxy?.port;
    let proxyUrl = `https://${proxyIP}:${proxyPort}`;

    if (!proxyIP || !proxyPort) {
        action.actionStatus = "FailedActionStatus";
        action.endTime = new Date();
        action.error = "No proxy IP or port provided";
        return action;
    }

    const agent = new HttpsProxyAgent(proxyUrl);

    let response;
    try {
        response = await fetch(url, {
             agent
        });
    } catch (error) {
        action.actionStatus = "FailedActionStatus";
        action.endTime = new Date();
        action.error = error.message;
        return action;
    }

    if (response.status === 200) {
        action.actionStatus = "CompletedActionStatus";
        action.endTime = new Date();
        action.duration = (action.endTime - action.startTime) / 1000;

        return action;
    } else {
        action.actionStatus = "FailedActionStatus";
        action.endTime = new Date();
        action.error = `Proxy returned status code ${response.status}`;
    }

    return action;
}
