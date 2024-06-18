import express from 'express';
import { addApplication, assignTo, getApplicationById, getApplications, updateApplicationStatus } from '../controllers/applicationController';
import upload from '../utils/upload';

const router = express.Router();

router.post('/create', upload.array('loanDocuments', 5), addApplication);
router.get('/get', getApplications);
router.post('/status/:id', updateApplicationStatus);
router.get('/getItem/:id', getApplicationById);
router.post('/assign/:id', assignTo);

export default router;
