export class BacklogAlreadyExistsError extends Error {
    constructor() {
        super("Game is already in your backlog");
    }
}