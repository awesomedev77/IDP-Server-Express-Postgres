import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import applicationRoutes from './routes/applicationRoutes';
import reportRoutes from './routes/reportRoutes';
import queryRoutes from './routes/queryRoutes';
import passportConfig from './config/passport';
import { AppDataSource } from './utils/db';
import { authenticate } from './middleware/authenticate';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
passportConfig(passport);

app.use('/api/auth', authRoutes);
app.use('/api/applications', passport.authenticate('jwt', { session: false }), authenticate, applicationRoutes);
app.use('/api/report',  passport.authenticate('jwt', { session: false }), authenticate, reportRoutes);
app.use('/api/query',  passport.authenticate('jwt', { session: false }), authenticate, queryRoutes);

const startServer = async () => {
  try {
    await AppDataSource.initialize(); // Ensure DB connection and initialize TypeORM
    console.log(`Server running on port ${PORT}`);
    app.listen(PORT);
  } catch (error) {
    console.error('Failed to start the server due to database connection error:', error);
    process.exit(1); // Exit the process with an error code
  }
};

  
  startServer();