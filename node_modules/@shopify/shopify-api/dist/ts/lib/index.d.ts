import { ShopifyRestResources } from '../rest/types';
import { FutureFlagOptions } from '../future/flags';
import { ConfigParams, ConfigInterface } from './base-types';
import { ShopifyClients } from './clients';
import { ShopifyAuth } from './auth';
import { ShopifySession } from './session';
import { ShopifyUtils } from './utils';
import { ShopifyWebhooks } from './webhooks';
import { ShopifyBilling } from './billing';
import { ShopifyLogger } from './logger';
import { ShopifyFlow } from './flow';
import { FulfillmentService } from './fulfillment-service';
export * from './error';
export * from './session/classes';
export * from '../rest/types';
export * from './types';
export * from './base-types';
export * from './auth/types';
export * from './billing/types';
export * from './clients/types';
export * from './session/types';
export * from './webhooks/types';
export * from './utils/types';
export interface Shopify<Params extends ConfigParams = ConfigParams, Resources extends ShopifyRestResources = ShopifyRestResources, Future extends FutureFlagOptions = FutureFlagOptions> {
    config: ConfigInterface<Params>;
    clients: ShopifyClients;
    auth: ShopifyAuth;
    session: ShopifySession;
    utils: ShopifyUtils;
    /**
     * Functions for working with webhooks.
     *
     * Most of these functions are used for interacting with shop-specific webhooks.
     * Unless your app needs different webhooks for different shops, we recommend using app-specific webhooks instead:
     *
     * {@link https://shopify.dev/docs/apps/build/webhooks/subscribe#app-specific-subscriptions}
     *
     * If you use only app-specific webhooks, the only function you will need is `shopify.webhooks.validate`.
     */
    webhooks: ShopifyWebhooks;
    billing: ShopifyBilling<Future>;
    logger: ShopifyLogger;
    rest: Resources;
    flow: ShopifyFlow;
    fulfillmentService: FulfillmentService;
}
export declare function shopifyApi<Params extends ConfigParams<Resources, Future>, Resources extends ShopifyRestResources, Future extends FutureFlagOptions>({ future, restResources, ...config }: {
    future?: Future;
    restResources?: Resources;
} & Params): Shopify<Params, Resources, Future>;
//# sourceMappingURL=index.d.ts.map