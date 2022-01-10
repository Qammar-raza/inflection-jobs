import { Schema, model } from 'mongoose';

const schema = new Schema({
  email: { type: String },
  password: { type: Object },
  status: {
    type: String,
    default: 'Trial',
    enum: ['Trial', 'Active', 'Cancelled']
  },
  admin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Users = model('users', schema, 'users');

export default Users;
