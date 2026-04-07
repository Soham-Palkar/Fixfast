import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import providerRoutes from './routes/providerRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import technicianRoutes from './routes/technicianRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - Allow all origins for development, then specific origins
app.use(cors({
  origin: [
    process.env.CLIENT_ORIGIN || "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true
}));

// Ensure preflight requests are handled for all routes
app.options("*", cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Root route - API documentation
app.get('/', (req, res) => {
  res.json({
    message: 'FixFast Backend API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/user/register': 'Register new user',
        'POST /api/auth/user/login': 'User login',
        'POST /api/auth/provider/register': 'Register new provider',
        'POST /api/auth/provider/login': 'Provider login'
      },
      providers: {
        'GET /api/providers': 'Get all providers',
        'GET /api/providers/:id': 'Get provider by ID',
        'PUT /api/providers/status': 'Update provider status (auth required)',
        'PUT /api/providers/location': 'Update provider location (auth required)'
      },
      bookings: {
        'POST /api/bookings': 'Create new booking (auth required)',
        'GET /api/bookings': 'Get bookings (auth required)',
        'POST /api/bookings/verify': 'Verify OTP (auth required)',
        'PUT /api/bookings/:id/status': 'Update booking status (auth required)',
        'PUT /api/bookings/:id/location': 'Update booking location (auth required)',
        'PUT /api/bookings/:id/review': 'Submit review (auth required)'
      }
    },
    health: '/health'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📱 Client origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server startup error:', error);
      process.exit(1);
    }
  });
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    startServer(PORT);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
