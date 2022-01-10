import moment from 'moment';
import { lowerCase } from 'lodash';

import Order from '../../../../models/order';
import Other from '../../../../models/other';
import Refund from '../../../../models/refund';

const SavePaymentReport = async ({
  storeId,
  marketplaceId,
  row
}) => {
  const { type } = row;
  const setObj = {
    storeId,
    marketplaceId,
    type,
    timestamp: moment(new Date(row.dateTime)).toDate(),
    amazonOrderId: row.orderId,
    sellerSku: row.sku,
    description: row.description,
    quantity: row.quantity,
    marketplace: lowerCase(row.marketplace),
    accountType: row.accountType,
    fulfillment: row.fulfillment,
    taxCollectionModel: row.taxCollectionModel,
    productSales: row.productSales,
    productSalesTax: row.productSalesTax,
    shippingCredits: row.shippingCredits,
    shippingCreditsTax: row.shippingCreditsTax,
    giftWrapCredits: row.giftWrapCredits,
    giftwrapCreditsTax: row.giftwrapCreditsTax,
    promotionalRebates: row.promotionalRebates,
    promotionalRebatesTax: row.promotionalRebatesTax,
    marketplaceWithheldTax: row.marketplaceWithheldTax,
    sellingFees: row.sellingFees,
    fbaFees: row.fbaFees,
    otherTransactionFees: row.otherTransactionFees,
    other: row.other,
    total: row.total
  };

  // type => Adjustment, Chargeback Refund, Deal Fee, Delivery Services, FBA Customer Return Fee,
  // FBA Inventory Fee, Fee Adjustment, Lightning Deal Fee, Order_Retrocharge, Refund_Retrocharge,
  // Service Fee, Transfer
  // Adjustment => storeId, marketplaceId, type, timestamp, amazonOrderId, sellerSku
  // Chargeback Refund => storeId, marketplaceId, type, timestamp, amazonOrderId, sellerSku
  // Deal Fee => storeId, marketplaceId, type, timestamp, amazonOrderId
  // Delivery Services => storeId, marketplaceId, type, timestamp, amazonOrderId
  // FBA Customer Return Fee => storeId, marketplaceId, type, timestamp, amazonOrderId, sellerSku
  // FBA Inventory Fee => storeId, marketplaceId, type, timestamp, amazonOrderId
  // Fee Adjustment => storeId, marketplaceId, type, timestamp, amazonOrderId, sellerSku
  // Lightning Deal Fee => storeId, marketplaceId, type, timestamp, amazonOrderId
  // Order Retrocharge => storeId, marketplaceId, type, timestamp, amazonOrderId
  // Order => storeId, marketplaceId, type, timestamp, amazonOrderId, sellerSku
  // Refund Retrocharge => storeId, marketplaceId, type, timestamp, amazonOrderId
  // Refund => storeId, marketplaceId, type, timestamp, amazonOrderId, sellerSku
  // Service Fee => storeId, marketplaceId, type, timestamp
  // Transfer => storeId, marketplaceId, type, timestamp
  // No Type => storeId, marketplaceId, type, timestamp, amazonOrderId

  switch (type) {
    case 'Order': {
      const entry = new Order({
        ...setObj
      });
      await entry.save();
      break;
    }

    case 'Refund': {
      const entry = new Refund({
        ...setObj
      });
      await entry.save();
      break;
    }

    default: {
      const entry = new Other({
        ...setObj
      });
      await entry.save();
      break;
    }
  }
};

const SaveReport = async ({
  storeId,
  marketplaceId,
  row
}) => {
  await SavePaymentReport({
    storeId,
    marketplaceId,
    row
  });

  return Promise.resolve();
};

export default SaveReport;
