import express from 'express';
import upload from '../utils/upload';
import { getDetailsByProcess } from '../controllers/detailController';

const router = express.Router();

// router.post('/create', upload.array('loanDocuments', 5), addApplication);
// router.get('/get', getApplications);
// router.post('/status/:id', updateApplicationStatus);
router.get('/process/:id', getDetailsByProcess);
router.get('/document/:id', getDetailsByProcess);
// router.post('/assign/:id', assignTo);

export default router;
