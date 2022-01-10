import { Schema, model } from 'mongoose';

const schema = Schema({
  storeId: { type: String },
  marketplaceId: { type: String },
  timestamp: { type: Date },
  unitsSold: { type: Number },
  orderSales: { type: Number },
  saleCostPrice: { type: Number },
  unitsRefunded: { type: Number },
  refundSales: { type: Number },
  refundCostPrice: { type: Number },
  grossSales: { type: Number },
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
  otherOfTransfer: { type: Number },
  netRevenues: { type: Number },
  productCosts: { type: Number },
  amazonFees: { type: Number },
  grossProfit: { type: Number },
  percentageOfNetRevenuesGrossProfit: { type: Number },
  opex: { type: Number },
  ebtida: { type: Number },
  percentageOfNetRevenuesEbtida: { type: Number }
}, {
  strict: false,
  timestamps: true
});

const MonthlySalesHistory = model('monthlySalesHistory', schema, 'monthlySalesHistory');

export default MonthlySalesHistory;
