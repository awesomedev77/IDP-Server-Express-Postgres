import express from 'express';
import { getAll, addType, editType, deleteType } from '../controllers/typeController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.get('/getAll', getAll);
router.post('/add', addType);
router.post('/edit/:id', editType);
router.delete('/delete/:id', deleteType);

export default router;