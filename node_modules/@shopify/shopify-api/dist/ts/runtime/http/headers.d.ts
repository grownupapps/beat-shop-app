import type { Headers } from './types';
/**
 * Canonicalizes a header name by capitalizing each segment and ensuring consistent hyphenation.
 *
 * @param hdr - The header name to canonicalize.
 * @returns The canonicalized header name.
 */
export declare function canonicalizeHeaderName(hdr: string): string;
/**
 * Retrieves all values associated with a canonicalized header name from the headers object.
 *
 * @param headers - The headers object or undefined.
 * @param needle_ - The header name to search for.
 * @returns An array of header values associated with the canonicalized header name.
 */
export declare function getHeaders(headers: Headers | undefined, needle_: string): string[];
/**
 * Retrieves the first value associated with a canonicalized header name from the headers object.
 *
 * @param headers - The headers object or undefined.
 * @param needle - The header name to search for.
 * @returns The first value associated with the canonicalized header name, or undefined if not found.
 */
export declare function getHeader(headers: Headers | undefined, needle: string): string | undefined;
/**
 * Sets a header to a single value, canonicalizing the header name.
 *
 * @param headers - The headers object.
 * @param key - The header name to set.
 * @param value - The value to assign to the header.
 */
export declare function setHeader(headers: Headers, key: string, value: string): void;
/**
 * Adds a value to an existing header, creating a new array if necessary, and canonicalizing the header name.
 *
 * @param headers - The headers object.
 * @param key - The header name to add to.
 * @param value - The value to add.
 */
export declare function addHeader(headers: Headers, key: string, value: string): void;
/**
 * Canonicalizes all headers in the headers object by ensuring consistent header names and values.
 *
 * @param hdr - The headers object to canonicalize.
 * @returns The headers object with canonicalized header names and values.
 */
export declare function canonicalizeHeaders(hdr: Headers): Headers;
/**
 * Removes a header from the headers object.
 *
 * @param headers - The headers object.
 * @param needle - The header name to remove.
 */
export declare function removeHeader(headers: Headers, needle: string): void;
/**
 * Converts a headers object into an array of tuples, where each tuple represents a header name and value.
 *
 * @param {Object|string[][]} headers - The headers object or undefined/null.
 * @returns {string[][]} An array of tuples where each tuple contains a header name and its corresponding value.
 *
 * @example
 * // Example headers object
 * const headers = {
 *   'Set-Cookie': 'a=b',
 *   'Set-Cookie': 'x=y'
 * };
 *
 * // Converted to an array of tuples
 * const result = convertHeadersToTuples(headers);
 * console.log(result);
 * // Output: [
 * //   ["Set-Cookie", "a=b"],
 * //   ["Set-Cookie", "x=y"]
 * // ]
 */
export declare function flatHeaders(headers: Headers | undefined | null): [string, string][];
//# sourceMappingURL=headers.d.ts.map