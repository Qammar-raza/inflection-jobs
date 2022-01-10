import { Schema, model } from 'mongoose';

const schema = Schema({
  _id: { type: String },
  storeId: { type: String },
  name: { type: String },
  lastUpdatedAt: { type: Date }
}, {
  timestamps: true
});

const LastUpdateTracker = model('lastUpdateTracker', schema, 'lastUpdateTracker');

export default LastUpdateTracker;
