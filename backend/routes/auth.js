import express from 'express';
const router = express.Router();
import { signUp } from '../controllers/signup.js';


// /auth/signup
router.post('/signup', signUp);


///login
export {
    router as authRoutes
}