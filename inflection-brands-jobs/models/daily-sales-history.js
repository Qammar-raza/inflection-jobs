import { Schema, model } from 'mongoose';

const schema = Schema({
  storeId: { type: String },
  marketplaceId: { type: String },
  type: { type: String },
  timestamp: { type: Date },
  sellerSku: { type: String },
  unitsSold: { type: Number },
  orderSales: { type: Number },
  saleCostPrice: { type: Number },
  unitsRefunded: { type: Number },
  refundSales: { type: Number },
  refundCostPrice: { type: Number },
  productSales: { type: Number },
  productSalesTax: { type: Number },
  shippingCredits: { type: Number },
  shippingCreditsTax: { type: Number },
  giftWrapCredits: { type: Number },
  giftwrapCreditsTax: { type: Number },
  promotionalRebates: { type: Number },
  promotionalRebatesTax: { type: Number },
  marketplaceWithheldTax: { type: Number },
  sellingFees: { type: Number },
  fbaFees: { type: Number },
  otherTransactionFees: { type: Number },
  other: { type: Number }
}, {
  strict: false,
  timestamps: true
});

const DailySalesHistory = model('dailySalesHistory', schema, 'dailySalesHistory');

export default DailySalesHistory;
