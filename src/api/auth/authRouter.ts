import express from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import { userLoginValidate, userRegisterValidate } from '@/common/middleware/auth';

const authRoutes = express.Router();

authRoutes.post('/register', userRegisterValidate, registerUser);

authRoutes.post('/login', userLoginValidate, loginUser);

export { authRoutes };
