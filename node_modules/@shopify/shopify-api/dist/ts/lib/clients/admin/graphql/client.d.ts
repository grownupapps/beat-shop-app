import { AdminApiClient, AdminOperations, ReturnData } from '@shopify/admin-api-client';
import { ApiVersion } from '../../../types';
import { ConfigInterface } from '../../../base-types';
import type { RequestReturn, GraphqlParams, GraphqlClientParams, GraphqlQueryOptions, GraphQLClientResponse } from '../../types';
import { Session } from '../../../session/session';
interface GraphqlClientClassParams {
    config: ConfigInterface;
}
export declare class GraphqlClient {
    static config: ConfigInterface;
    readonly session: Session;
    readonly client: AdminApiClient;
    readonly apiVersion?: ApiVersion;
    constructor(params: GraphqlClientParams);
    query<T = undefined>(params: GraphqlParams): Promise<RequestReturn<T>>;
    request<T = undefined, Operation extends keyof Operations = string, Operations extends AdminOperations = AdminOperations>(operation: Operation, options?: GraphqlQueryOptions<Operation, Operations>): Promise<GraphQLClientResponse<T extends undefined ? ReturnData<Operation, Operations> : T>>;
    private graphqlClass;
}
export declare function graphqlClientClass({ config, }: GraphqlClientClassParams): typeof GraphqlClient;
export {};
//# sourceMappingURL=client.d.ts.map