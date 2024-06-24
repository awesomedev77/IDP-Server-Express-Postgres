import express from 'express';
import { addMessage, createQueryAndMessage, getQueriesByProcess, editMessage } from '../controllers/queryController';

const router = express.Router();


router.get('/:id', getQueriesByProcess);
router.post('/', createQueryAndMessage);
router.post('/add', addMessage)
router.post('/edit', editMessage)

export default router;