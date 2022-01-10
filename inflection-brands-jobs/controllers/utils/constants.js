export const JOB_STATES = {
  STARTED: '_STARTED_',
  IN_PROGRESS: '_IN_PROGRESS_',
  SAVING: '_SAVING_',
  COMPLETED: '_COMPLETED_',
  FAILED: '_FAILED_',
  NEXT: '_NEXT_',
  THROTTLE: '_THROTTLE_'
};

export const PROCESSING_REPORTS = [
  'GET_MERCHANT_LISTINGS_ALL_DATA',
  'GET_FLAT_FILE_ALL_ORDERS_DATA_BY_LAST_UPDATE_GENERAL',
  'GET_FBA_FULFILLMENT_CURRENT_INVENTORY_DATA'
];

export const RETRYABLE_ERRORS = [
  'getaddrinfo ENOTFOUND',
  'connect ETIMEDOUT',
  'ECONNRESET',
  'EPIPE',
  'internal error',
  'throttl',
  'quota will reset',
  'Service temporarily unavailable',
  'Internal service error',
  'empty response',
  'Unexpected close tag',
  'Unclosed root tag',
  'no message',
  'socket hang up',
  '502 Bad Gateway',
  'Client network socket disconnected',
  'Service Unavailable',
  '/500.html is not found'
];

export const UNKNOWN_CHARS = [{
  key: '\\\\\\\\xf6',
  value: 'ö'
}, {
  key: '\\\\\\\\xe4',
  value: 'ä'
}, {
  key: '\\\\\\\\xfc',
  value: 'ü'
}, {
  key: '�',
  value: 'ü'
}, {
  key: '\\\\…',
  value: ''
}, {
  key: '&quot;',
  value: ''
}, {
  key: '&amp;',
  value: '&'
}, {
  key: '\\\\–',
  value: '-'
}];

export const IGNORE_FIELDS_FROM_CONVVERTING_TO_NUMBER = [
  'asin',
  'asin1',
  'asin2',
  'asin3',
  'sellersku',
  'sku',
  'productid',
  'fnsku',
  'fulfillmentnetworksku',
  'merchantorderid',
  'amazonorderid',
  'generatedreportid',
  'reportrequestid',
  'feedsubmissionid',
  'postalcode'
];

export const FULLFILMENT_TYPE = {
  AMAZON: 'AFN',
  MERCHANT: 'MFN'
};

export const HEADERS_COLUMN = [
  'dateTime',
  'settlementId',
  'type',
  'orderId',
  'sku',
  'description',
  'quantity',
  'marketplace',
  'accountType',
  'fulfillment',
  'orderCity',
  'orderState',
  'orderPostal',
  'taxCollectionModel',
  'productSales',
  'productSalesTax',
  'shippingCredits',
  'shippingCreditsTax',
  'giftWrapCredits',
  'giftwrapCreditsTax',
  'promotionalRebates',
  'promotionalRebatesTax',
  'marketplaceWithheldTax',
  'sellingFees',
  'fbaFees',
  'otherTransactionFees',
  'other',
  'total'
];

export const FIELDS_TO_CONVERT_TO_NUMBER = [
  'quantity',
  'productSales',
  'productSalesTax',
  'shippingCredits',
  'shippingCreditsTax',
  'giftWrapCredits',
  'giftwrapCreditsTax',
  'promotionalRebates',
  'promotionalRebatesTax',
  'marketplaceWithheldTax',
  'sellingFees',
  'fbaFees',
  'otherTransactionFees',
  'other',
  'total'
];

export const FIELDS_TO_CONVERT_CURRENCY = [
  'productSales',
  'productSalesTax',
  'shippingCredits',
  'shippingCreditsTax',
  'giftWrapCredits',
  'giftwrapCreditsTax',
  'promotionalRebates',
  'promotionalRebatesTax',
  'marketplaceWithheldTax',
  'sellingFees',
  'fbaFees',
  'otherTransactionFees',
  'other',
  'total'
];

export const BRITISH_CURRENCY = [
  'ATVPDKIKX0DER', // US
  'A2EUQ1WTGCTBG2', // CA
  'A1F83G8C2ARO7P' // UK
];
