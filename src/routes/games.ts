import { Router } from "express";

const router = Router();

const games = [
    { id: 1, title: "Elden Ring" },
    { id: 2, title: "Hades" },
    { id: 3, title: "Cyberpunk 2077" }
];

type ValidationResult =
    | {
        success: true;
        value: string;
    }
    | {
        success: false;
        error: string;
    };

function validateTitle(title: unknown): ValidationResult {
    if (typeof title !== "string") {
        return {
            success: false,
            error: "Title must be a string"
        };
    }

    const sanitizedTitle = title.trim();

    if (sanitizedTitle.length === 0) {
        return {
            success: false,
            error: "Title cannot be empty"
        };
    }

    return {
        success: true,
        value: sanitizedTitle
    };
}

router.get("/", (req, res) => {
    const search = req.query.search;
    const sort = req.query.sort;
    const order = req.query.order;

    // Validate query parameters
    if (search !== undefined && typeof search !== "string") {
        return res.status(400).json({
            message: "Search must be a string"
        });
    }

    if (sort !== undefined && typeof sort !== "string") {
        return res.status(400).json({
            message: "Sort must be a string"
        });
    }

    if (order !== undefined && typeof order !== "string") {
        return res.status(400).json({
            message: "Order must be a string"
        });
    }

    // Validate sort and order parameters
    if (order !== undefined && sort === undefined) {
        return res.status(400).json({
            message: "The 'order' parameter requires a 'sort' parameter"
        });
    }

    if (sort !== undefined && sort !== "title" && sort !== "id") {
        return res.status(400).json({
            message: "Sort must be either 'title' or 'id'"
        });
    }

    if (order !== undefined && order !== "asc" && order !== "desc") {
        return res.status(400).json({
            message: "Order must be either 'asc' or 'desc'"
        });
    }

    let result = [...games];

    if (search !== undefined) {
        const sanitizedSearch = search.trim().toLowerCase();

        result = result.filter((game) =>
            game.title.toLowerCase().includes(sanitizedSearch)
        );
    }

    if (sort !== undefined) {
        const sortOrder = order ?? "asc";

        if (sort === "title") {
            result.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.title.localeCompare(b.title);
                }

                return b.title.localeCompare(a.title);
            });
        }

        if (sort === "id") {
            result.sort((a, b) => {
                if (sortOrder === "asc") {
                    return a.id - b.id;
                }

                return b.id - a.id;
            });
        }
    }

    return res.status(200).json(result);
});

router.get("/:id", (req, res) => {
    const id = Number(req.params.id);
    const game = games.find((g) => g.id === id);

    if (!game) {
        return res.status(404).json({
            message: "Game not found"
        });
    }

    return res.json(game);
});

router.post("/", (req, res) => {
    const title = req.body.title;

    const validationResult = validateTitle(title);

    if (!validationResult.success) {
        return res.status(400).json({
            message: validationResult.error
        });
    }

    const newId = games.length > 0 ? Math.max(...games.map((g) => g.id)) + 1 : 1;

    const newGame = { id: newId, title: validationResult.value };

    games.push(newGame);

    return res.status(201).json(newGame);
});

router.put("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const game = games.find((game) => game.id === id);

    if (!game) {
        return res.status(404).json({
            message: "Game not found"
        });
    }

    const title = req.body.title;

    const validationResult = validateTitle(title);

    if (!validationResult.success) {
        return res.status(400).json({
            message: validationResult.error
        });
    }

    game.title = validationResult.value;

    return res.status(200).json(game);

});

router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const gameIndex = games.findIndex((game) => game.id === id);

    if (gameIndex === -1) {
        return res.status(404).json({
            message: "Game not found"
        });
    }

    games.splice(gameIndex, 1);

    return res.status(204).send();
});

export default router;