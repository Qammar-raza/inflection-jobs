import { Schema, model } from 'mongoose';

const schema = new Schema({
  userId: { type: String },
  storeId: { type: String },
  marketplaceId: { type: String },
  path: { type: String },
  timestamp: { type: Date },
  status: { type: String } // Downloaded, Completed
}, {
  timestamps: true
});

const ReportsDownloaded = model('reportsDownloaded', schema, 'reportsDownloaded');

export default ReportsDownloaded;
