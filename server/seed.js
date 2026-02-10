import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Course from './models/Course.js';
import User from './models/User.js';
import ForumThread from './models/ForumThread.js';
import Submission from './models/Submission.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusphere');
        console.log('MongoDB Connected for Seeding');

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Course.deleteMany({}),
            ForumThread.deleteMany({}),
            Submission.deleteMany({})
        ]);

        // Create Users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);
        const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Sahej@#1330', salt);

        const admin = await User.create({
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL || 'tannu@edusphere.com',
            password: adminPassword,
            role: 'ADMIN',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
        });

        console.log('Users Created');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();