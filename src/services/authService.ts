import type { LoginInput } from "../validators/loginValidator.js";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js";
import bcryptjs from "bcryptjs";
import prisma from "../db/prisma.js";
import { removePassword } from "../utils/userUtils.js";
import jwt from "jsonwebtoken";


export async function loginUser(data: LoginInput) {
    const user = await prisma.user.findUnique({
        where: { email: data.email }
    });

    if (!user) {
        throw new InvalidCredentialsError();
    }

    const isPasswordValid = await bcryptjs.compare(data.password, user.password);

    if (!isPasswordValid) {
        throw new InvalidCredentialsError();
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT secret is not defined in the environment variables.");
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "7d"
    });

    return { user: removePassword(user), token };
}
