import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
// import applicationRoutes from './routes/applicationRoutes';
import detailRoutes from "./routes/detailRoutes";
import typeRoutes from './routes/typeRoutes';
import processRoutes from './routes/processRoutes';
import documentRoutes from './routes/documentRoutes';
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
app.use(express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/document', passport.authenticate('jwt', { session: false }), authenticate, documentRoutes);
app.use('/api/type', passport.authenticate('jwt', { session: false }), authenticate, typeRoutes);
app.use('/api/process', passport.authenticate('jwt', { session: false }), authenticate, processRoutes);
app.use('/api/details', passport.authenticate('jwt', { session: false }), authenticate, detailRoutes);
app.use('/api/report', passport.authenticate('jwt', { session: false }), authenticate, reportRoutes);
app.use('/api/query', passport.authenticate('jwt', { session: false }), authenticate, queryRoutes);

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