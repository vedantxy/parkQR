const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function test() {
    try {
        console.log('Testing Bcrypt...');
        const hash = await bcrypt.hash('test', 10);
        console.log('Bcrypt OK:', hash);

        console.log('Testing JWT...');
        const token = jwt.sign({ id: '123' }, 'secret');
        console.log('JWT OK:', token);

        process.exit(0);
    } catch (err) {
        console.error('CRASH:', err.message);
        process.exit(1);
    }
}

test();
