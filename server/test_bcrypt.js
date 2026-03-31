const bcrypt = require('bcryptjs');

async function test() {
  try {
    console.log('Testing bcryptjs...');
    const salt = await bcrypt.genSalt(10);
    console.log('Salt:', salt);
    const hash = await bcrypt.hash('password123', salt);
    console.log('Hash:', hash);
    const isMatch = await bcrypt.compare('password123', hash);
    console.log('Match:', isMatch);
  } catch (err) {
    console.error('Bcrypt Error:', err);
  }
}

test();
