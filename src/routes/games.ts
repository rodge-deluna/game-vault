import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

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

router.get("/", async (req, res) => {
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
    
    const query: Prisma.GameFindManyArgs = {};

    if (search !== undefined) {
        query.where = {
            title: {
                contains: search.trim(),
                mode: "insensitive"
            }
        };
    }

    if (sort !== undefined) {
        query.orderBy = {
            [sort]: order ?? "asc"
        };
    }

    const games = await prisma.game.findMany(query);

    return res.status(200).json(games);
});

router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const game = await prisma.game.findUnique({
        where: {
            id
        }
    });

    if (!game) {
        return res.status(404).json({
            message: "Game not found"
        });
    }

    return res.json(game);
});

router.post("/", async (req, res) => {
    const title = req.body.title;

    const validationResult = validateTitle(title);

    if (!validationResult.success) {
        return res.status(400).json({
            message: validationResult.error
        });
    }

    const newGame = await prisma.game.create({
        data: {
            title: validationResult.value
        }
    });

    return res.status(201).json(newGame);
});

router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

    const title = req.body.title;


    const validationResult = validateTitle(title);

    if (!validationResult.success) {
        return res.status(400).json({
            message: validationResult.error
        });
    }

    const existingGame = await prisma.game.findUnique({
        where: { id }
    });

    if (!existingGame) {
        return res.status(404).json({
            message: "Game not found"
        });
    }

    const updatedGame = await prisma.game.update({
        where: {
            id
        },
        data: {
            title: validationResult.value
        }
    });

    return res.status(200).json(updatedGame);

});

router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            message: "Invalid game ID"
        });
    }

     const existingGame = await prisma.game.findUnique({
        where: { id }
    });

    if (!existingGame) {
        return res.status(404).json({
            message: "Game not found"
        });
    }

    await prisma.game.delete({
        where: {
            id
        }
    });

    return res.status(204).send();
});

export default router;