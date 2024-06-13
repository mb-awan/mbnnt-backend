import express from 'express';

import { loginUser, registerUser } from '@/common/controllers/index';
import { userLoginValidate, userRegisterValidate } from '@/common/utils/userValidation';

const routes = express.Router();

routes.post('/register', userRegisterValidate, registerUser);

routes.post('/login', userLoginValidate, loginUser);

export { routes };
