import type { Request, Response } from "express";
export declare function register(req: Request, res: Response): Promise<void>;
export declare function login(req: Request, res: Response): Promise<void>;
export declare function refresh(req: Request, res: Response): Promise<void>;
export declare function logout(req: Request, res: Response): Promise<void>;
export declare function profile(req: Request, res: Response): Promise<void>;
export declare function updateProfile(req: Request, res: Response): Promise<void>;
export declare function listUsers(_req: Request, res: Response): Promise<void>;
export declare function updateUserRole(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=authController.d.ts.map