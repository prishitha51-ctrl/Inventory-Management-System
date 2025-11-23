import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { initializeDB } from './src/db/database.js';
import { initializeDefaultAdmin } from './src/models/UserModel.js';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.get('/', (req, res) => {
    res.send('Inventory Manager API is running.');
});

app.use('/api', authRoutes);
app.use('/api', productRoutes);

async function startServer() {
    try {
        await initializeDB();
        await initializeDefaultAdmin();
        
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();