import { FutureFlagOptions } from '../../future/flags';
import { ConfigInterface } from '../base-types';
import { GraphqlClient } from '../clients/admin';
import { BillingCheck, BillingCheckResponseObject } from './types';
interface InternalParams {
    client: GraphqlClient;
    isTest?: boolean;
    plans?: string | string[];
}
export declare function check<Config extends ConfigInterface, Future extends FutureFlagOptions = Config['future']>(config: Config): BillingCheck<Future>;
export declare function assessPayments({ client, isTest, plans, }: InternalParams): Promise<BillingCheckResponseObject>;
export {};
//# sourceMappingURL=check.d.ts.map