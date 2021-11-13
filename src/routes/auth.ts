import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { TokenValidation } from '../libs/verifyToken';
const auth: Router = Router();




auth.post('/signupTeacher', AuthController.signupTeacher);

auth.post('/signupStudent', AuthController.signupStudent);

auth.post('/signin', AuthController.signin);

auth.post('/updateAccount', AuthController.updateAccount);

auth.get('/profile', TokenValidation, AuthController.profile);

auth.post('/iconProfile', AuthController.iconProfile);

auth.post('/recoverPassword', AuthController.recoverPassword);


export default auth