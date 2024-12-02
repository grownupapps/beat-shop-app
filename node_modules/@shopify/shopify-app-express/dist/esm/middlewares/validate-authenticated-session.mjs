import { InvalidJwtError } from '@shopify/shopify-api';
import { redirectToAuth } from '../redirect-to-auth.mjs';
import { redirectOutOfApp } from '../redirect-out-of-app.mjs';
import { hasValidAccessToken } from './has-valid-access-token.mjs';

function validateAuthenticatedSession({ api, config, }) {
    return function validateAuthenticatedSession() {
        return async (req, res, next) => {
            config.logger.debug('Running validateAuthenticatedSession');
            let sessionId;
            try {
                sessionId = await api.session.getCurrentId({
                    isOnline: config.useOnlineTokens,
                    rawRequest: req,
                    rawResponse: res,
                });
            }
            catch (error) {
                config.logger.error(`Error when loading session from storage: ${error}`);
                handleSessionError(req, res, error);
                return undefined;
            }
            let session;
            if (sessionId) {
                try {
                    session = await config.sessionStorage.loadSession(sessionId);
                }
                catch (error) {
                    config.logger.error(`Error when loading session from storage: ${error}`);
                    res.status(500);
                    res.send(error.message);
                    return undefined;
                }
            }
            let shop = api.utils.sanitizeShop(req.query.shop) || session?.shop;
            if (session && shop && session.shop !== shop) {
                config.logger.debug('Found a session for a different shop in the request', { currentShop: session.shop, requestShop: shop });
                return redirectToAuth({ req, res, api, config });
            }
            if (session) {
                config.logger.debug('Request session found and loaded', {
                    shop: session.shop,
                });
                if (session.isActive(api.config.scopes)) {
                    config.logger.debug('Request session exists and is active', {
                        shop: session.shop,
                    });
                    if (await hasValidAccessToken(api, session)) {
                        config.logger.debug('Request session has a valid access token', {
                            shop: session.shop,
                        });
                        res.locals.shopify = {
                            ...res.locals.shopify,
                            session,
                        };
                        return next();
                    }
                }
            }
            const bearerPresent = req.headers.authorization?.match(/Bearer (.*)/);
            if (bearerPresent) {
                if (!shop) {
                    shop = await setShopFromSessionOrToken(api, session, bearerPresent[1]);
                }
            }
            const redirectUri = `${config.auth.path}?shop=${shop}`;
            config.logger.info(`Session was not valid. Redirecting to ${redirectUri}`, { shop });
            return redirectOutOfApp({ api, config })({
                req,
                res,
                redirectUri,
                shop: shop,
            });
        };
    };
}
function handleSessionError(_req, res, error) {
    switch (true) {
        case error instanceof InvalidJwtError:
            res.status(401);
            res.send(error.message);
            break;
        default:
            res.status(500);
            res.send(error.message);
            break;
    }
}
async function setShopFromSessionOrToken(api, session, token) {
    let shop;
    if (session) {
        shop = session.shop;
    }
    else if (api.config.isEmbeddedApp) {
        const payload = await api.session.decodeSessionToken(token);
        shop = payload.dest.replace('https://', '');
    }
    return shop;
}

export { validateAuthenticatedSession };
//# sourceMappingURL=validate-authenticated-session.mjs.map
