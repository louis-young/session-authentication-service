import { Router } from "express";
import { knex } from "../knex/knex.js";
import argon2 from "argon2";
import {
  checkPasswordValidity,
  sendPasswordResetConfirmationEmail,
} from "../utilities/passwords.js";
import { regenerateSession } from "../utilities/sessions.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { token, email, password } = request.body;

    if (!token || !email || !password) {
      return response
        .status(400)
        .json({ error: "Token, email and password are required." });
    }

    const passwordValidity = checkPasswordValidity(password);

    if (!passwordValidity.valid) {
      return response.status(400).json({ error: passwordValidity.feedback });
    }

    const isValidToken = await knex("password_reset_tokens")
      .where({ email, token, used: false })
      .where("expiration", ">=", new Date().toISOString())
      .first();

    if (!isValidToken) {
      return response.status(400).json({
        error:
          "We couldn't reset your password, please try the password reset process again.",
      });
    }

    await knex("password_reset_tokens").where({ email }).update({ used: true });

    const hashedPassword = await argon2.hash(password);

    await knex("users").where({ email }).update({ password: hashedPassword });

    await sendPasswordResetConfirmationEmail(email);

    await regenerateSession(request.session);

    const user = await knex("users").where({ email }).first();

    request.session.userId = user.id;

    request.attachCSRFCookie(request, response);

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
