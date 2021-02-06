import { Router } from "express";

import knex from "../knex/knex.js";

import argon2 from "argon2";

import { regenerateSession } from "../utilities/utilities.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "An email and password are required." });
    }

    const user = await knex("users").where({ email }).first();

    if (!user) {
      return response.status(400).json({ error: "Incorrect email and password combination." });
    }

    const passwordsMatch = await argon2.verify(user.password, password);

    if (!passwordsMatch) {
      return response.status(400).json({ error: "Incorrect email and password combination." });
    }

    await regenerateSession(request.session);

    request.session.userId = user.id;

    response.json({
      message: "Successfully logged user in.",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    response.status(500).json({ error: error.message }); // TODO: Make generic in production.
  }
});

export default router;
