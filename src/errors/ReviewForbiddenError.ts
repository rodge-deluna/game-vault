export class ReviewForbiddenError extends Error {
    constructor() {
        super("You are not allowed to modify this review");
    }
}