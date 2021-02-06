import { Router } from "express";
import knex from "../knex/knex.js";
import argon2 from "argon2";

const router = Router();

router.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;

    // Check fields are present.
    if (!email || !password) {
      return response.status(400).json({ error: "An email and password are required." });
    }

    // Check if the user exists.
    const userExists = await knex("users").where({ email }).first();

    if (userExists) {
      return response.status(400).json({ error: "A user with this email address already exists." });
    }

    // Check the minimum password length.
    const minimumPasswordLength = 8;

    if (password.length < minimumPasswordLength) {
      return response
        .status(400)
        .json({ error: `A password must be no less than ${minimumPasswordLength} characters.` });
    }

    // Check the maximum password length.
    const maximumPasswordLength = 64;

    if (password.length > maximumPasswordLength) {
      return response
        .status(400)
        .json({ error: `A password must be no more than ${maximumPasswordLength} characters.` });
    }

    // Hash the password.
    const hash = await argon2.hash(password);

    await knex("users").insert({ email, password: hash });

    const user = await knex("users").select(["email"]).where({ email }).first();

    // TODO: Log the user in...

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.get("/", (request, response) => {
  const n = request.session.views || 0;

  request.session.views = n + 1;

  response.end(`${n} views.`);
});

export default router;
