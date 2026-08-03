export class GameNotFoundError extends Error {
    constructor() {
        super("Game not found");
    }
}