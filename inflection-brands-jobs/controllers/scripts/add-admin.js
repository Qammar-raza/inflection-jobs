import crypto from 'crypto';

import User from '../../models/users';

// http://localhost:5500/api/v1/script?method=AddAdmin

const AddAdmin = async () => {
  try {
    const iv = crypto.randomBytes(16);
    const algorithm = process.env.HASHING_ALGORITHM;
    const hashingKey = process.env.HASHING_SECRET_KEY;
    const cipher = crypto.createCipheriv(algorithm, hashingKey, iv);
    const encrypted = Buffer.concat([cipher.update('qbatch'), cipher.final()]);
    const user = new User({
      email: 'admin@inflectionbrands.com',
      password: {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
      },
      status: 'Active',
      admin: true
    });
    await user.save();
  } catch (error) {
    console.log('\n\n', 'error', error.message);
  }
};

export default AddAdmin;
