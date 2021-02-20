import { Router } from "express";

import knex from "../knex/knex.js";

import zxcvbn from "zxcvbn";
import argon2 from "argon2";

import { isValidPassword } from "../utilities/utilities.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { token, email, password } = request.body;

    if (!token || !password) {
      return response.status(400).json({ error: "A token, email and password are required." });
    }

    if (!isValidPassword(password)) {
      return response.status(400).json({ error: `Please use a stronger password.` });
    }

    const validToken = await knex("password_reset_tokens")
      .where({ email, token, used: false })
      .where("expiration", ">=", new Date().toISOString())
      .first();

    console.log(new Date().toISOString());

    if (!validToken) {
      return response.status(400).json({ error: "Token not found. Please try the reset password process again." });
    }

    await knex("password_reset_tokens").where({ email }).update({ used: true });

    const hash = await argon2.hash(password);

    await knex("users").where({ email }).update({ password: hash });

    return response.json({ message: "Password reset. Please login with your new password." });
  } catch (error) {
    response.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
