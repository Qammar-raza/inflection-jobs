import mongoose from 'mongoose';

const { MONGO_URL } = process.env;

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true
};
mongoose
  .connect(
    MONGO_URL,
    option
  )
  .then(async (db) => {
    console.log('MongoDB Connected');
  })
  .catch(err => console.log('MongoDB::', err));
