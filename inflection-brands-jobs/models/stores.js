import { Schema, model } from 'mongoose';

const schema = new Schema({
  userId: { type: String },
  storeName: { type: String },
  sellerId: { type: String },
  region: { type: String },
  refreshToken: { type: String },
  subscriptions: [{
    queueName: { type: String },
    notificationType: { type: String },
    destinationId: { type: String },
    subscriptionId: { type: String }
  }],
  marketplaces: [{
    marketplaceId: { type: String },
    country: { type: String },
    countryCode: { type: String }
  }]
}, {
  timestamps: true
});

const Stores = model('stores', schema, 'stores');

export default Stores;
