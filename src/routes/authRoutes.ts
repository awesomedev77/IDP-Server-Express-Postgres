import express from 'express';
import passport from 'passport';
import { register, login, getUsers, getAll, addUser, editUser, deleteUser } from '../controllers/authController';
import { authenticate } from '../middleware/authenticate';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', passport.authenticate('jwt', { session: false }), authenticate, getUsers);
router.get('/getAll', passport.authenticate('jwt', { session: false }), authenticate, getAll);
router.post('/user/add', passport.authenticate('jwt', { session: false }), authenticate, addUser);
router.post('/user/edit/:id', passport.authenticate('jwt', { session: false }), authenticate, editUser);
router.delete('/user/delete/:id', passport.authenticate('jwt', { session: false }), authenticate, deleteUser);

export default router;