import { Schema, model } from 'mongoose';

const schema = new Schema({
  storeId: { type: String },
  marketplaceId: { type: String },
  count: { type: Number },
  timestamp: { type: Date },
  isSynced: { type: Boolean }
}, {
  timestamps: true
});

const CostFiles = model('costFiles', schema, 'costFiles');

export default CostFiles;
