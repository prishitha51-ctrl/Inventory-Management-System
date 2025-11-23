import bcrypt from 'bcryptjs';
import { getDB } from '../db/database.js';

export async function initializeDefaultAdmin() {
    const db = getDB();
    const admin = await db.get('SELECT * FROM users WHERE username = ?', ['admin']);
    if (!admin) {
        const hashedPassword = await bcrypt.hash('password', 10);
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
        console.log('Default admin created.');
    }
}

export async function findUserByUsername(username) {
    const db = getDB();
    return db.get('SELECT * FROM users WHERE username = ?', [username]);
}

export async function createUser(username, password) {
    const db = getDB();
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword]
    );
}
