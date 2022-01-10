import { Schema, model } from 'mongoose';

const schema = new Schema({
  storeId: { type: String },
  marketplaceId: { type: String },
  sellerSku: { type: String }
}, {
  timestamps: true
});

const Products = model('products', schema, 'products');

export default Products;
