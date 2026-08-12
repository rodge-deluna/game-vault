import request from "supertest";
import app from "../../app.js";

type TestUserInput = {
    username: string;
    email: string;
    password: string;
};

export async function createTestUserAndLogin(data: TestUserInput) {
    const userResponse = await request(app)
        .post("/users")
        .send(data);

    const loginResponse = await request(app)
        .post("/auth/login")
        .send({
            email: data.email,
            password: data.password
        });

    return {
        user: userResponse.body,
        token: loginResponse.body.token
    };
}