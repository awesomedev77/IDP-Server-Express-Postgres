import express from 'express';
import { getAll, addProcess, getAllProcesses } from '../controllers/processController';

const router = express.Router();

router.get('/getAll', getAllProcesses);
router.get('/get', getAll);
router.post('/add', addProcess);
// router.post('/edit/:id', editProcess);
// router.delete('/delete/:id', deleteProcess);

export default router;