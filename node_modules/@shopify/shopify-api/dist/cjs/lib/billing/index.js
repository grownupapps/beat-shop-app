'use strict';

var check = require('./check.js');
var request = require('./request.js');
var cancel = require('./cancel.js');
var subscriptions = require('./subscriptions.js');
var createUsageRecord = require('./create-usage-record.js');
var updateUsageSubscriptionCappedAmount = require('./update-usage-subscription-capped-amount.js');

function shopifyBilling(config) {
    return {
        check: check.check(config),
        request: request.request(config),
        cancel: cancel.cancel(config),
        subscriptions: subscriptions.subscriptions(config),
        createUsageRecord: createUsageRecord.createUsageRecord(config),
        updateUsageCappedAmount: updateUsageSubscriptionCappedAmount.updateUsageCappedAmount(config),
    };
}

exports.shopifyBilling = shopifyBilling;
//# sourceMappingURL=index.js.map
