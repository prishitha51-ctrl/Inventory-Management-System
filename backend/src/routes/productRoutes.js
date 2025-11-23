import express from 'express';
import { Parser } from 'json2csv';
import csv from 'csv-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Readable } from 'stream';
import {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductHistory,
    findProductByName,
    getAllProductsForExport,
    getProductsByIds
} from '../models/ProductModel.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

router.use(authMiddleware);

router.get('/products', async (req, res) => {
    try {
        const products = await getAllProducts(req.query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/products', async (req, res) => {
    try {
        const existing = await findProductByName(req.body.name);
        if (existing) return res.status(400).json({ message: 'Product name must be unique.' });
        const newProductId = await createProduct(req.body);
        res.status(201).json({ id: newProductId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/products/:id', async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'User not authenticated for history logging.' });
        await updateProduct(req.params.id, req.body, req.user);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/products/:id', async (req, res) => {
    try {
        await deleteProduct(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/products/:id/history', async (req, res) => {
    try {
        const history = await getProductHistory(req.params.id);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/products/export', async (req, res) => {
    try {
        const products = await getAllProductsForExport();
        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(products);
        res.header('Content-Type', 'text/csv');
        res.attachment('all_products.csv');
        res.send(csvData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/products/export-custom', async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'No product IDs provided for custom export.' });
        const products = await getProductsByIds(ids);
        if (products.length === 0) return res.status(404).json({ message: 'No products found for the provided IDs.' });
        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(products);
        res.header('Content-Type', 'text/csv');
        res.attachment('selected_products.csv');
        res.send(csvData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/products/import', async (req, res) => {
    if (!req.files || !req.files.csvFile) return res.status(400).json({ message: 'No CSV file uploaded.' });
    const file = req.files.csvFile;
    const records = [];
    let addedCount = 0;
    let skippedCount = 0;
    try {
        await new Promise((resolve, reject) => {
            Readable.from(file.data)
                .pipe(csv({ skipComments: true }))
                .on('data', (data) => records.push(data))
                .on('end', () => resolve())
                .on('error', (error) => reject(new Error('CSV parse error: ' + error.message)));
        });
        for (const row of records) {
            try {
                const productName = row.name ? String(row.name).trim() : '';
                if (!productName) { skippedCount++; continue; }
                const productData = {
                    name: productName,
                    unit: row.unit || '',
                    category: row.category || '',
                    brand: row.brand || '',
                    stock: parseInt(row.stock) || 0,
                    status: row.status || 'In Stock',
                    image: row.image || '',
                };
                const existing = await findProductByName(productData.name);
                if (existing) { skippedCount++; continue; }
                await createProduct(productData);
                addedCount++;
            } catch {
                skippedCount++;
            }
        }
        res.json({ message: 'Import completed.', addedCount, skippedCount });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error processing CSV file.' });
    }
});

export default router;
