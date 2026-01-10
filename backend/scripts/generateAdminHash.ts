import bcrypt from 'bcryptjs';

const password = 'Admin123!';
const hash = bcrypt.hashSync(password, 10);

console.log('Email: admin@trustauto.co.ke');
console.log('Password: Admin123!');
console.log('Hash:', hash);
console.log('\nCopy the hash above and update backend/prisma/seed.ts');
