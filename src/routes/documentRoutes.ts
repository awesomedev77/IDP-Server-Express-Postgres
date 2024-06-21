import express from 'express';
import upload from '../utils/upload';
import { addDocuments, getDocuments } from '../controllers/documentController';

const router = express.Router();

router.post('/create', upload.array('documents', 5), addDocuments);
router.get('/get', getDocuments);

export default router;
