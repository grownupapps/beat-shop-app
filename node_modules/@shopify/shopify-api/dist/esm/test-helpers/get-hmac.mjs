import crypto from 'crypto';

function getHmac(body, apiSecretKey) {
    return crypto
        .createHmac('sha256', apiSecretKey)
        .update(body, 'utf8')
        .digest('base64');
}

export { getHmac };
//# sourceMappingURL=get-hmac.mjs.map
