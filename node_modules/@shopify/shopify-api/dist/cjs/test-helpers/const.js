'use strict';

const API_KEY = 'testApiKey';
const API_SECRET_KEY = 'testApiSecretKey';
const APP_URL = 'https://my-test-app.myshopify.io';
const TEST_SHOP_NAME = 'test-shop';
const TEST_SHOP = `${TEST_SHOP_NAME}.myshopify.com`;
const SHOPIFY_HOST = `admin.shopify.com/store/${TEST_SHOP_NAME}`;
const BASE64_HOST = Buffer.from(SHOPIFY_HOST).toString('base64');
const USER_ID = 12345;

exports.API_KEY = API_KEY;
exports.API_SECRET_KEY = API_SECRET_KEY;
exports.APP_URL = APP_URL;
exports.BASE64_HOST = BASE64_HOST;
exports.SHOPIFY_HOST = SHOPIFY_HOST;
exports.TEST_SHOP = TEST_SHOP;
exports.TEST_SHOP_NAME = TEST_SHOP_NAME;
exports.USER_ID = USER_ID;
//# sourceMappingURL=const.js.map
