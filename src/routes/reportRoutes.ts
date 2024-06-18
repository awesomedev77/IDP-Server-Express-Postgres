import express from 'express';
import { addDocument, generateReport, getReportByDocumentId } from '../controllers/reportController';
import upload from '../utils/upload';

const router = express.Router();


router.get('/:id', getReportByDocumentId);
router.post('/:id', upload.array('documents', 5), addDocument);
router.get('/generate/:id', generateReport);


export default router;