import { Router } from "express";

import knex from "../knex/knex.js";
import argon2 from "argon2";
import mail from "../mail/mail.js";

import { checkPasswordValidity, regenerateSession } from "../utilities/utilities.js";

const sendPasswordResetConfirmationEmail = (email) => {
  const content = {
    to: email,
    from: process.env.MAIL_FROM_ADDRESS,
    subject: "Your password has been reset",
    text:
      "Your password has successfully been reset. If you didn't request this, please immediately reset your password.",
    html:
      "Your password has successfully been reset. If you didn't request this, please immediately reset your password.",
  };

  return mail.send(content);
};

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { token, email, password } = request.body;

    if (!token || !email || !password) {
      return response.status(400).json({ error: "Token, email and password are required." });
    }

    const passwordValidity = checkPasswordValidity(password);

    if (!passwordValidity.valid) {
      return response.status(400).json({ error: passwordValidity.feedback });
    }

    const validToken = await knex("password_reset_tokens")
      .where({ email, token, used: false })
      .where("expiration", ">=", new Date().toISOString())
      .first();

    if (!validToken) {
      return response
        .status(400)
        .json({ error: "We couldn't reset your password, please try the password reset process again." });
    }

    await knex("password_reset_tokens").where({ email }).update({ used: true });

    const hash = await argon2.hash(password);

    await knex("users").where({ email }).update({ password: hash });

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
