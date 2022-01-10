import { Schema, model } from 'mongoose';

const schema = new Schema({
  name: { type: String },
  sellerId: { type: String },
  monsSelDirPaid: { type: String },
  monsSelDirMcid: { type: String }
}, {
  timestamps: true
});

const AccountDetails = model('accountDetails', schema, 'accountDetails');

export default AccountDetails;
