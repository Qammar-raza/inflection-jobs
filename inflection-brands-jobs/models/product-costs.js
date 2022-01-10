import { Schema, model } from 'mongoose';

const schema = new Schema({
  storeId: { type: String },
  marketplaceId: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  sellerSku: { type: String },
  costPrice: { type: Number },
  costs: { type: Array },
  costFileId: { type: String }
}, {
  timestamps: true
});

const ProductCosts = model('productCosts', schema, 'productCosts');

export default ProductCosts;
