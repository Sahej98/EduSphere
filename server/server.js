import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import submissionRoutes from './routes/submissions.js';
import forumRoutes from './routes/forum.js';
import analyticsRoutes from './routes/analytics.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ESM __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust Proxy (Required for cookies on Render/Heroku behind load balancers)
app.set('trust proxy', 1);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Config for Split Deployment
// Allow specific client URL from Env, or localhost for dev
app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        'http://localhost:5173',
        'https://your-vercel-app.vercel.app' // Fallback example
    ].filter(Boolean),
    credentials: true
}));

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Upload Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // In production (Render), this URL might need to be absolute to the server domain
    const serverBaseUrl = process.env.SERVER_BASE_URL || `${req.protocol}://${req.get('host')}`;
    const url = `${serverBaseUrl}/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename, originalName: req.file.originalname });
});

// DB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusphere')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Root Endpoint for Health Check
app.get('/', (req, res) => {
    res.send('EduSphere API is Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});