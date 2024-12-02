import express from 'express';
import { DeliveryMethod } from '@shopify/shopify-api';
import { AppInstallations } from '../app-installations.mjs';
import { deleteAppInstallationHandler } from '../middlewares/ensure-installed-on-shop.mjs';
import { process } from './process.mjs';

function processWebhooks({ api, config, }) {
    return function ({ webhookHandlers }) {
        mountWebhooks(api, config, webhookHandlers);
        return [
            express.text({ type: '*/*', limit: '500kb' }),
            async (req, res) => {
                await process({
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
    const appInstallations = new AppInstallations(config);
    api.webhooks.addHandlers({
        APP_UNINSTALLED: {
            deliveryMethod: DeliveryMethod.Http,
            callbackUrl: config.webhooks.path,
            callback: deleteAppInstallationHandler(appInstallations, config),
        },
    });
}

export { processWebhooks };
//# sourceMappingURL=index.mjs.map
