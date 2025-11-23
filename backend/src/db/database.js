import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import dotenv from 'dotenv';
dotenv.config();

let db;

export async function initializeDB() {
    if (db) return db;

    db = await open({
        filename: process.env.DB_FILE || './sqlite-db.sqlite',
        driver: sqlite3.Database,
    });
    
    console.log('Database connected');

    await db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        );

        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            unit TEXT,
            category TEXT,
            brand TEXT,
            stock INTEGER DEFAULT 0,
            status TEXT,
            image TEXT
        );

        CREATE TABLE IF NOT EXISTS inventory_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            old_quantity INTEGER,
            new_quantity INTEGER,
            change_date TEXT,
            user_info TEXT,
            FOREIGN KEY (product_id) REFERENCES products(id)
        );
    `);

    return db;
}

export function getDB() {
    if (!db) throw new Error("Database not initialized. Call initializeDB first.");
    return db;
}
