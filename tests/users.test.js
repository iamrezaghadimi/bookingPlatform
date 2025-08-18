const request = require('supertest')
const mongoose = require('mongoose')

const { User } = require("../models/User")
const { app } = require("../app")

const helpers = {
    signUp: (data) => request(app).post("/users/signup").send(data),
    signIn: (data) => request(app).post("/users/signin").send(data),
    signOut: () => request(app).post("/users/signout")
}

describe("auth system", () => {

    const testUser = {
        name: "testuser",
        email: "t@t.com",
        password: "secrrrrrrrrrrr222",
        roles: ['admin']
    }

    beforeEach(async () => {
        await User.deleteMany({});
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

    describe("user reg", () => {
        it("should reg a new user", async () => {
            const response = await helpers.signUp(testUser).expect(201)
            expect(response.body.user).toHaveProperty("_id")
            expect(response.body.user.email).toBe(testUser.email)
            expect(response.body.user).not.toHaveProperty("password")
        });

        it("should reject a duplicate emal reg", async () => {
            const response1 = await helpers.signUp(testUser).expect(201)
            const response2 = await helpers.signUp(testUser).expect(400)
            expect(response2.body.error.message).toMatch(/already/i)
         
        });


    })
})

