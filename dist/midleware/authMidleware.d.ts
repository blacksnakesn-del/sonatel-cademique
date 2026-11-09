import type { Request, Response, NextFunction } from "express";
import { type UserRole } from "../models/User.js";
export declare function authenticate(req: Request, res: Response, next: NextFunction): Promise<void>;
export declare function authorize(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMidleware.d.ts.map