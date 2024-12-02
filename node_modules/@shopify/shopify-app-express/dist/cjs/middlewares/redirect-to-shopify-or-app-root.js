'use strict';

function redirectToShopifyOrAppRoot({ api, config, }) {
    return function () {
        return async function (req, res) {
            if (res.headersSent) {
                config.logger.info('Response headers have already been sent, skipping redirection to host', { shop: res.locals.shopify?.session?.shop });
                return;
            }
            const host = api.utils.sanitizeHost(req.query.host);
            const redirectUrl = api.config.isEmbeddedApp
                ? await api.auth.getEmbeddedAppUrl({
                    rawRequest: req,
                    rawResponse: res,
                })
                : `/?shop=${res.locals.shopify.session.shop}&host=${encodeURIComponent(host)}`;
            config.logger.debug(`Redirecting to host at ${redirectUrl}`, {
                shop: res.locals.shopify.session.shop,
            });
            res.redirect(redirectUrl);
        };
    };
}

exports.redirectToShopifyOrAppRoot = redirectToShopifyOrAppRoot;
//# sourceMappingURL=redirect-to-shopify-or-app-root.js.map
