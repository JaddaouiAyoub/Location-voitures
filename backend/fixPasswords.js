const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function fixPasswords() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'car_rental_db'
    });

    const password = 'password123';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log(`Setting all demo users password to: ${password}`);
    console.log(`Hash: ${hashedPassword}`);

    const [result] = await connection.execute(
        'UPDATE users SET password = ? WHERE email IN (?, ?, ?, ?, ?)',
        [
            hashedPassword,
            'admin@carrental.com',
            'agent@carrental.com',
            'client@carrental.com',
            'marie@example.com',
            'pierre@example.com'
        ]
    );

    console.log(`Updated ${result.affectedRows} users.`);
    await connection.end();
}

fixPasswords().catch(console.error);
