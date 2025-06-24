import { testProxy } from "./proxyMethods.js";

export class Proxy {
    constructor(record) {
        this.ip = record.ip;
        this.port = record.port;
        this.source = record.source;
        this.domain = {};
        this.status = "NotTested";
        this.failedCounter = 0;
    }

    get record() {
        /**
         * Get the proxy
         * @returns {Object} proxy
         */
        let record = {
            "@type": "Proxy",
            ip: this.ip,
            port: this.port,
            status: this.status,
        };
        return record;
    }

    toString() {
        /**
         * Get the proxy as a string
         * @returns {String} proxy
         */
        let content = `${this.ip}:${this.port}\n`;
        for (let domain in this.domain) {
            let maxDomain = this.getLatestTest(domain);

            content += ` - ${domain}: ${maxDomain.actionStatus} (${maxDomain.startTime})\n`;
        }
        return content;
    }

    getLatestTest(url) {
        /**
         * Get the status of the proxy
         * @returns {String} status
         */

        url = url || "https://www.google.com";

        let domain = url;
        try {
            domain = new URL(url).hostname || url;
        } catch (error) {}

        if (!this.domain[domain]) {
            return undefined;
        }

        let maxTest = this.domain[domain].reduce((maxItem, item) =>
            maxItem.startTime > item.startTime ? maxItem : item,
        );
        return maxTest;
    }

    async test(url, setAsFailed=false) {
        /**
         * Test the proxy
         * @returns {Object} proxy
         */

        url = url || "https://www.google.com";

        let testResult = await testProxy(this.record, url);

        this.addAction(testResult, url);

        if (testResult.actionStatus === "FailedActionStatus" && setAsFailed){
            this.status = 'inactive'
        }
        
    }

    addAction(action, url) {
        /**
         * Add an action to the proxy
         * @returns {Object} proxy
         * @example
         *
         */

        url = url || action.instrument.url;
        let domain = new URL(url).hostname;

        this.domain[domain] = this.domain[domain] || [];
        this.domain[domain].push(action);

        if (action.actionStatus === "CompletedActionStatus") {
            this.status = "active";
        } else {
            this.counter += 1;
        }

        if (this.counter > 3) {
            this.status = "inactive";
        }
    }

    isActive(url) {
        /**
         * Check if the proxy is active
         * @returns {Boolean} isActive
         * */

        if (!url) {
            return this.status === "active";
        }

        if (this.status === "inactive") {
            return false;
        }

        let maxDomain = this.getLatestTest(url);
        if (maxDomain?.actionStatus === "CompletedActionStatus") {
            return true;
        } else {
            return false;
        }

        return false;
    }

    setActive(url) {
        /**
         * Set the proxy as inactive
         * @returns {Boolean} isActive
         * */

        if (!url) {
            return this.status !== "active";
        }

        let action = {
            "@type": "Action",
            name: "Test Proxy",
            description: "Test a proxy",
            object: this.record,
            startTime: new Date(),
            endTime: new Date(),
            actionStatus: "CompletedActionStatus",
            duration: 0,
        };

        this.addAction(action);
    }

    setInactive(url) {
        /**
         * Set the proxy as inactive
         * @returns {Boolean} isActive
         * */

        let action = {
            "@type": "Action",
            name: "Test Proxy",
            description: "Test a proxy",
            object: this.record,
            startTime: new Date(),
            endTime: new Date(),
            actionStatus: "FailedActionStatus",
            duration: 0,
        };

        this.addAction(action);
    }
}
