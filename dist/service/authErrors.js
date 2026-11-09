export class AuthServiceError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
        this.name = "AuthServiceError";
    }
}
//# sourceMappingURL=authErrors.js.map