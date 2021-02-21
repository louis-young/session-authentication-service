import { Router } from "express";

import knex from "../knex/knex.js";
import argon2 from "argon2";

import { checkPasswordValidity, regenerateSession } from "../utilities/utilities.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: "An email and password are required." });
    }

    const userExists = await knex("users").where({ email }).first();

    if (userExists) {
      return response.status(400).json({ error: "A user with this email address already exists." });
    }

    const passwordValidity = checkPasswordValidity(password);

    if (!passwordValidity.valid) {
      return response.status(400).json({ error: passwordValidity.feedback });
    }

    const hash = await argon2.hash(password);

    const [user] = await knex("users").insert({ email, password: hash }).returning(["id", "email"]);

    await regenerateSession(request.session);

    request.session.userId = user.id;

    request.attachCSRFCookie(request, response);

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
