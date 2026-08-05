export class ReviewNotFoundError extends Error {
    constructor() {
        super("Review not found");
    }
}