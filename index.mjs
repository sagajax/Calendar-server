import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.mjs';
import authRoutes from './routes/auth.mjs';
import eventRoutes from './routes/events.mjs';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server is running...');
});