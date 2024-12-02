'use strict';

var crypto = require('crypto');

function getHmac(body, apiSecretKey) {
    return crypto
        .createHmac('sha256', apiSecretKey)
        .update(body, 'utf8')
        .digest('base64');
}

exports.getHmac = getHmac;
//# sourceMappingURL=get-hmac.js.map
