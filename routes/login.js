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
      return response.status(400).json({ error: "Invalid email and password combination." });
    }

    const passwordsMatch = await argon2.verify(user.password, password);

    if (!passwordsMatch) {
      return response.status(400).json({ error: "Invalid email and password combination." });
    }

    await regenerateSession(request.session);

    request.session.userId = user.id;

    request.attachCSRFCookie(request, response);

    response.json(user);
  } catch (error) {
    console.error(error.message);
    response.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
