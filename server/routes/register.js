import { Router } from "express";
import { knex } from "../knex/knex.js";
import argon2 from "argon2";
import { checkPasswordValidity } from "../utilities/passwords.js";
import { regenerateSession } from "../utilities/sessions.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const existingUser = await knex("users").where({ email }).first();

    if (existingUser) {
      return response
        .status(400)
        .json({ error: "An account with this email address already exists." });
    }

    const passwordValidity = checkPasswordValidity(password);

    if (!passwordValidity.valid) {
      return response.status(400).json({ error: passwordValidity.feedback });
    }

    const hashedPassword = await argon2.hash(password);

    const [user] = await knex("users")
      .insert({ email, password: hashedPassword })
      .returning(["id", "email"]);

    await regenerateSession(request.session);

    request.session.userId = user.id;

    request.attachCSRFCookie(request, response);

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
