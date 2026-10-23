export class BacklogAlreadyExistsError extends Error {
    constructor() {
        super("Game is already in your backlog");
    }
}

export class BacklogNotFoundError extends Error {
    constructor() {
        super("This game is not in your backlog")
    }
}