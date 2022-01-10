import { Schema, model } from 'mongoose';

const schema = Schema({
  storeId: { type: String },
  marketplaceId: { type: String },
  type: { type: String },
  timestamp: { type: Date },
  sellerSku: { type: String },
  quantity: { type: Number },
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
  strict: false,
  timestamps: true
});

const CombineData = model('combineData', schema, 'combineData');

export default CombineData;
