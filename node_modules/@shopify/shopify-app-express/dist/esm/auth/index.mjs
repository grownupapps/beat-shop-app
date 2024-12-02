import { redirectToAuth } from '../redirect-to-auth.mjs';
import { authCallback } from './auth-callback.mjs';

function auth({ api, config }) {
    return {
        begin() {
            return async (req, res) => redirectToAuth({ req, res, api, config });
        },
        callback() {
            return async (req, res, next) => {
                config.logger.info('Handling request to complete OAuth process');
                const oauthCompleted = await authCallback({
                    req,
                    res,
                    api,
                    config,
                });
                if (oauthCompleted) {
                    next();
                }
            };
        },
    };
}

export { auth };
//# sourceMappingURL=index.mjs.map
