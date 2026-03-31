require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function test() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected.');

    const fs = require('fs');
    let debugInfo = `User model type: ${typeof User}\n`;
    debugInfo += `User model keys: ${Object.keys(User).join(', ')}\n`;
    debugInfo += `User prototype keys: ${Object.keys(Object.getPrototypeOf(User)).join(', ')}\n`;
    fs.writeFileSync('debug_output.txt', debugInfo);
    
    console.log('Creating test user...');
    const user = await User.create({
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log('✅ User created:', user.email);

    await User.deleteOne({ _id: user._id });
    console.log('✅ Test user cleaned up.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error in test:', err);
    process.exit(1);
  }
}

test();
