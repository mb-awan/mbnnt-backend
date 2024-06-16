import express from 'express';

import { loginUser, registerUser } from '@/common/controllers/auth';
import { deleteUser, editUser, showUser } from '@/common/controllers/user';
import { userLoginValidate, userRegisterValidate } from '@/common/middleware/auth';
import { ensureAuthentication } from '@/common/middleware/userAuth';
const authRoutes = express.Router();

// register
authRoutes.post('/register', userRegisterValidate, registerUser);
// login
authRoutes.post('/login', userLoginValidate, loginUser);
//show user
authRoutes.get('/user', ensureAuthentication, showUser);
//edit user
authRoutes.put('/user', ensureAuthentication, editUser);
// delete user
authRoutes.delete('/user', ensureAuthentication, deleteUser);

export { authRoutes };
