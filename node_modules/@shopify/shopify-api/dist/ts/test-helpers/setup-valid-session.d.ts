import type { SessionParams } from '../lib/session/types';
import { Session } from '../lib/session/session';
type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;
/**
 * Creates and returns a fake Session for the shop defined in sessionParams.
 *
 * @param sessionParams The Session parameters to use when creating the fake Session.
 * @returns {Session} The fake Session created.
 */
export declare function setUpValidSession(sessionParams: DeepPartial<SessionParams> & Pick<SessionParams, 'shop' | 'expires'>): Session;
export {};
//# sourceMappingURL=setup-valid-session.d.ts.map