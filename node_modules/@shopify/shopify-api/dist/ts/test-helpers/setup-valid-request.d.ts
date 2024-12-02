export declare enum RequestType {
    Admin = 0,
    Bearer = 1,
    Extension = 2,
    Public = 3
}
interface ValidBaseRequestOptions {
    type: RequestType.Admin | RequestType.Bearer;
    store: string;
    apiSecretKey: string;
    apiKey: string;
}
interface ValidExtensionRequestOptions {
    type: RequestType.Extension;
    store: string;
    apiSecretKey: string;
    body?: any;
    headers?: Record<string, string>;
}
interface ValidPublicRequestOptions {
    type: RequestType.Public;
    store: string;
    apiSecretKey: string;
}
export type ValidRequestOptions = ValidBaseRequestOptions | ValidExtensionRequestOptions | ValidPublicRequestOptions;
/**
 * Duplicates a Request object and decorates the duplicated object with fake authorization headers or query string parameters.
 *
 * @param {ValidRequestOptions} options Provides the type of authorization method to fake for the provided Request, and the inputs required to fake the authorization.
 * @param {Request} request The Request object to be decorated with fake authorization headers or query string parameters.
 * @returns {Request} A duplicate of the provided Request object with faked authorization headers or query string parameters.
 */
export declare function setUpValidRequest(options: ValidRequestOptions, request: Request): Promise<Request<unknown, CfProperties<unknown>>>;
export {};
//# sourceMappingURL=setup-valid-request.d.ts.map