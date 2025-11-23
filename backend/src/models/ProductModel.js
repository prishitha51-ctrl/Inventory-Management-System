import { getDB } from '../db/database.js';

export async function getAllProducts({ limit = 5, page = 1, sort = 'id', order = 'asc', category, name }) {
    const db = getDB();
    const offset = (page - 1) * limit;

    let whereClauses = [];
    let params = [];

    if (category) {
        whereClauses.push('category = ?');
        params.push(category);
    }
    if (name) {
        whereClauses.push('name LIKE ?');
        params.push(`%${name}%`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const orderBySql = `ORDER BY ${sort} ${order.toUpperCase()}`;
    const limitSql = `LIMIT ? OFFSET ?`;
    
    const count = await db.get(`SELECT COUNT(*) as count FROM products ${whereSql}`, params);
    const totalItems = count.count;
    const totalPages = Math.ceil(totalItems / limit);

    const products = await db.all(`SELECT * FROM products ${whereSql} ${orderBySql} ${limitSql}`, [...params, limit, offset]);
    
    return {
        products,
        currentPage: page,
        totalPages,
        totalItems
    };
}

export async function getProductsByIds(ids) {
    const db = getDB();
    if (!ids || ids.length === 0) return [];
    const placeholders = ids.map(() => '?').join(',');
    return db.all(`SELECT * FROM products WHERE id IN (${placeholders}) ORDER BY id ASC`, ids);
}

export async function getAllProductsForExport() {
    const db = getDB();
    return db.all(`SELECT * FROM products ORDER BY id ASC`);
}

export async function getProductHistory(productId) {
    const db = getDB();
    return db.all('SELECT * FROM inventory_history WHERE product_id = ? ORDER BY change_date DESC', [productId]);
}

export async function createProduct(data) {
    const db = getDB();
    const result = await db.run(`
        INSERT INTO products (name, unit, category, brand, stock, status, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [data.name, data.unit, data.category, data.brand, data.stock, data.status, data.image]);

    return result.lastID;
}

export async function updateProduct(id, data, user) {
    const db = getDB();
    const oldProduct = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    
    if (!oldProduct) throw new Error('Product not found.');
    
    const { name, unit, category, brand, stock, status, image } = data;

    await db.run(`
        UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?
    `, [name, unit, category, brand, stock, status, image, id]);

    if (oldProduct.stock !== stock) {
        await db.run(`
            INSERT INTO inventory_history (product_id, old_quantity, new_quantity, change_date, user_info)
            VALUES (?, ?, ?, ?, ?)
        `, [id, oldProduct.stock, stock, new Date().toISOString(), user.username]);
    }
}

export async function deleteProduct(id) {
    const db = getDB();
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    await db.run('DELETE FROM inventory_history WHERE product_id = ?', [id]);
}

export async function findProductByName(name) {
    const db = getDB();
    return db.get('SELECT * FROM products WHERE name = ?', [name]);
}