import { Router } from 'express';
import { createUserController } from './userController.js';
export const userRouter = Router();
userRouter.post('/', createUserController);
//# sourceMappingURL=userRouter.js.map