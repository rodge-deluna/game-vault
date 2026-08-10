export class ReviewForbiddenError extends Error {
    constructor() {
        super("You are not allowed to modify this review");
    }
}

export class ReviewNotFoundError extends Error {
    constructor() {
        super("Review not found");
    }
}

export class ReviewAlreadyExistsError extends Error {
    constructor() {
        super("You have already reviewed this game")
    }
}