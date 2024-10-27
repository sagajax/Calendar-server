import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.mjs';
import authRoutes from './routes/auth.mjs';
import eventRoutes from './routes/events.mjs';

dotenv.config();
const app = express();

app.set('trust proxy', 1);
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'https://calendar-client-7g5n.vercel.app', "https://calendar-client-teal.vercel.app"];
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
          const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
          return callback(new Error(msg), false);
      }
      return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());


// Connect to MongoDB
connectDB();

// Middleware
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