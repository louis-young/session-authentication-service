import { Router } from "express";

import knex from "../knex/knex.js";
import crypto from "crypto";
import mail from "../mail/mail.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { email } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      return response
        .status(200)
        .json({ message: "If an account with this email address exists, we have sent you a password reset email." });
    }

    await knex("password_reset_tokens").where({ email }).update({ used: true });

    const token = crypto.randomBytes(64).toString("base64");

    const expiration = new Date();

    expiration.setHours(expiration.getHours() + 2);

    await knex("password_reset_tokens").insert({ email, expiration, token, used: false });

    const link = `${CLIENT_BASE_URL}/reset-password?token=${token}`;

    const content = {
      to: email,
      from: process.env.MAIL_FROM_ADDRESS,
      subject: "Password Reset",
      text: `Please visit ${link} to reset your password.`,
      html: `Please click <a href="${link}" target="_blank">here</a> to reset your password.`,
    };

    await mail.send(content);

    return response
      .status(200)
      .json({ message: "If an account with this email address exists, we have sent you a password reset email." });
  } catch (error) {
    response.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
