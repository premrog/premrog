// @ts-nocheck
import config from "@opennextjs/cloudflare/config";

const cloudflareConfig = {
    default: {
        runtime: "edge",
        override: {
            wrapper: "cloudflare-node",
            converter: "edge",
            proxyExternalRequest: "fetch",
            incrementalCache: "dummy",
            tagCache: "dummy",
            queue: "dummy",
    },
    },
};

export default cloudflareConfig;