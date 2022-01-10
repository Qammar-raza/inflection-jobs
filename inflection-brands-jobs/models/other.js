import { Schema, model } from 'mongoose';

const schema = Schema({
  storeId: { type: String },
  marketplaceId: { type: String },
  type: { type: String },
  timestamp: { type: Date },
  amazonOrderId: { type: String },
  sellerSku: { type: String },
  settlementId: { type: String },
  description: { type: String },
  quantity: { type: Number },
  marketplace: { type: String },
  accountType: { type: String },
  fulfillment: { type: String },
  taxCollectionModel: { type: String },
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
  other: { type: Number },
  total: { type: Number }
}, {
  timestamps: true
});

const Other = model('other', schema, 'other');

export default Other;
