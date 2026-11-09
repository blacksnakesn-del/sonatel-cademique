export declare function register(data: unknown): Promise<{
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "LEARNER" | "TEACHER";
    createdAt: any;
}>;
export declare function getProfile(userId: number): Promise<{
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "LEARNER" | "TEACHER";
    createdAt: any;
}>;
export declare function updateProfile(userId: number, data: unknown): Promise<{
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "LEARNER" | "TEACHER";
    createdAt: any;
}>;
export declare function listUsers(): Promise<{
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "LEARNER" | "TEACHER";
    createdAt: any;
}[]>;
export declare function setUserRole(userId: number, role: unknown): Promise<{
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "LEARNER" | "TEACHER";
    createdAt: any;
}>;
//# sourceMappingURL=authUsers.d.ts.map