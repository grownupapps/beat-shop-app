'use strict';

class AppInstallations {
    sessionStorage;
    constructor(config) {
        if (!config.sessionStorage.findSessionsByShop) {
            throw new Error('To use this Express package, you must provide a session storage manager that implements findSessionsByShop');
        }
        if (!config.sessionStorage.deleteSessions) {
            throw new Error('To use this Express package, you must provide a session storage manager that implements deleteSessions');
        }
        this.sessionStorage = config.sessionStorage;
    }
    async includes(shopDomain) {
        const shopSessions = await this.sessionStorage.findSessionsByShop(shopDomain);
        if (shopSessions.length > 0) {
            for (const session of shopSessions) {
                if (session.accessToken)
                    return true;
            }
        }
        return false;
    }
    async delete(shopDomain) {
        const shopSessions = await this.sessionStorage.findSessionsByShop(shopDomain);
        if (shopSessions.length > 0) {
            await this.sessionStorage.deleteSessions(shopSessions.map((session) => session.id));
        }
    }
}

exports.AppInstallations = AppInstallations;
//# sourceMappingURL=app-installations.js.map
