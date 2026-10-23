export class GameNotFoundError extends Error {
    constructor() {
        super("Game not found");
    }
}

export class GameAlreadyExistsError extends Error {
    constructor() {
        super("Game has already been imported");
        this.name = "GameAlreadyExistsError";
    }
}