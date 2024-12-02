import { ConfigInterface, ConfigParams } from '../base-types';
import { FutureFlagOptions } from '../../future/flags';
import { BillingRequest } from './types';
export declare function request<Config extends ConfigInterface<Params>, Params extends ConfigParams<any, Future>, Future extends FutureFlagOptions>(config: Config): BillingRequest;
//# sourceMappingURL=request.d.ts.map