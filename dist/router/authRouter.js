import { Router } from "express";
import * as authController from '../controller/authController.js';
import { authenticate, authorize } from "../midleware/authMidleware.js";
export const authRouter = Router();
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.get('/profile', authenticate, authController.profile);
authRouter.patch('/profile', authenticate, authController.updateProfile);
authRouter.get('/users', authenticate, authorize("ADMIN"), authController.listUsers);
authRouter.patch('/users/:userId/role', authenticate, authorize("ADMIN"), authController.updateUserRole);
//# sourceMappingURL=authRouter.js.map