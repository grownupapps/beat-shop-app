import { check } from './check.mjs';
import { request } from './request.mjs';
import { cancel } from './cancel.mjs';
import { subscriptions } from './subscriptions.mjs';
import { createUsageRecord } from './create-usage-record.mjs';
import { updateUsageCappedAmount } from './update-usage-subscription-capped-amount.mjs';

function shopifyBilling(config) {
    return {
        check: check(config),
        request: request(config),
        cancel: cancel(config),
        subscriptions: subscriptions(config),
        createUsageRecord: createUsageRecord(config),
        updateUsageCappedAmount: updateUsageCappedAmount(config),
    };
}

export { shopifyBilling };
//# sourceMappingURL=index.mjs.map
