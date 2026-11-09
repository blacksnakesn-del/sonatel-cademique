import { Router } from 'express';
import { homeController } from './controller/authController.js';
export const homeRouter = Router();
homeRouter.get('/', homeController);
//# sourceMappingURL=router.js.map