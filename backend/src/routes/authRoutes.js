import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { findUserByUsername, createUser } from '../models/UserModel.js';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await findUserByUsername(username);
        if (existingUser) return res.status(400).json({ message: 'Username already exists.' });
        await createUser(username, password);
        res.status(201).json({ message: 'User created successfully.' });
    } catch {
        res.status(500).json({ message: 'Failed to create user.' });
    }
});

export default router;
