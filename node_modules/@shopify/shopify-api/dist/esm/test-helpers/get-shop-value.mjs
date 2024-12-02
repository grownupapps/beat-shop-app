/**
 * Returns a fake shop URL for a store name to use when faking authorization in testing.
 *
 * @param store The store name for which to create a fake shop URL.
 * @returns {string} A fake shop URL for the store name.
 */
function getShopValue(store) {
    return `${store}.myshopify.com`;
}

export { getShopValue };
//# sourceMappingURL=get-shop-value.mjs.map
