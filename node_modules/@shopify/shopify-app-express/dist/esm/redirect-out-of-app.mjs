function redirectOutOfApp({ api, config, }) {
    return function redirectOutOfApp({ req, res, redirectUri, shop }) {
        if ((!api.config.isEmbeddedApp && isFetchRequest(req)) ||
            req.headers.authorization?.match(/Bearer (.*)/)) {
            appBridgeHeaderRedirect(config, res, redirectUri);
        }
        else if (req.query.embedded === '1') {
            exitIframeRedirect(config, req, res, redirectUri, shop);
        }
        else {
            serverSideRedirect(config, res, redirectUri, shop);
        }
    };
}
function appBridgeHeaderRedirect(config, res, redirectUri) {
    config.logger.debug(`Redirecting: request has bearer token, returning headers to ${redirectUri}`);
    res.status(403);
    res.append('Access-Control-Expose-Headers', [
        'X-Shopify-Api-Request-Failure-Reauthorize',
        'X-Shopify-Api-Request-Failure-Reauthorize-Url',
    ]);
    res.header('X-Shopify-API-Request-Failure-Reauthorize', '1');
    res.header('X-Shopify-API-Request-Failure-Reauthorize-Url', redirectUri);
    res.end();
}
function exitIframeRedirect(config, req, res, redirectUri, shop) {
    config.logger.debug(`Redirecting: request is embedded, using exitiframe path to ${redirectUri}`, { shop });
    const queryParams = new URLSearchParams({
        ...req.query,
        shop,
        redirectUri,
    }).toString();
    res.redirect(`${config.exitIframePath}?${queryParams}`);
}
function serverSideRedirect(config, res, redirectUri, shop) {
    config.logger.debug(`Redirecting: request is at top level, going to ${redirectUri} `, { shop });
    res.redirect(redirectUri);
}
function isFetchRequest(req) {
    return req.xhr || req.headers['sec-fetch-dest'] === 'empty';
}

export { redirectOutOfApp };
//# sourceMappingURL=redirect-out-of-app.mjs.map
