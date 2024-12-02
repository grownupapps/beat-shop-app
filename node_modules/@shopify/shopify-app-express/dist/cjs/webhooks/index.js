'use strict';

var express = require('express');
var shopifyApi = require('@shopify/shopify-api');
var appInstallations = require('../app-installations.js');
var ensureInstalledOnShop = require('../middlewares/ensure-installed-on-shop.js');
var process = require('./process.js');

function processWebhooks({ api, config, }) {
    return function ({ webhookHandlers }) {
        mountWebhooks(api, config, webhookHandlers);
        return [
            express.text({ type: '*/*', limit: '500kb' }),
            async (req, res) => {
                await process.process({
                    req,
                    res,
                    api,
                    config,
                });
            },
        ];
    };
}
function mountWebhooks(api, config, handlers) {
    api.webhooks.addHandlers(handlers);
    // Add our custom app uninstalled webhook
    const appInstallations$1 = new appInstallations.AppInstallations(config);
    api.webhooks.addHandlers({
        APP_UNINSTALLED: {
            deliveryMethod: shopifyApi.DeliveryMethod.Http,
            callbackUrl: config.webhooks.path,
            callback: ensureInstalledOnShop.deleteAppInstallationHandler(appInstallations$1, config),
        },
    });
}

exports.processWebhooks = processWebhooks;
//# sourceMappingURL=index.js.map
