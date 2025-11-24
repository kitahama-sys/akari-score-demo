import bcrypt from 'bcryptjs';

const password = 'AkariDemo2024!';
const hash = bcrypt.hashSync(password, 10);
console.log('Password hash:', hash);
