import type { LoginInput } from "../validators/loginValidator.js";
import { InvalidCredentialsError } from "../errors/InvalidCredentialsError.js";
import bcryptjs from "bcryptjs";
import prisma from "../db/prisma.js";
import { removePassword } from "../utils/userUtils.js";


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

    return removePassword(user);
}
