import express from 'express';
import { addMessage, createQueryAndMessage, getQueriesByApplication, editMessage } from '../controllers/queryController';

const router = express.Router();


router.get('/:id', getQueriesByApplication);
router.post('/', createQueryAndMessage);
router.post('/add', addMessage)
router.post('/edit', editMessage)

export default router;