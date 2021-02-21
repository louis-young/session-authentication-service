import { Router } from "express";

import knex from "../knex/knex.js";
import crypto from "crypto";
import mail from "../mail/mail.js";

const generatePasswordResetToken = () => {
  const bytes = crypto.randomBytes(64).toString("base64");

  const token = bytes.replace(/\//g, "_").replace(/\+/g, "-");

  return token;
};

const generatePasswordResetExpiryDate = () => {
  const date = new Date();

  date.setHours(date.getHours() + 2);

  return date;
};

const sendPasswordResetEmail = (token, email) => {
  const link = `${process.env.CLIENT_BASE_URL}/reset-password?token=${token}&email=${email}`;

  const content = {
    to: email,
    from: process.env.MAIL_FROM_ADDRESS,
    subject: "Password Reset",
    text: `Please visit ${link} to reset your password.`,
    html: `Please click <a href="${link}" target="_blank">here</a> to reset your password.`,
  };

  return mail.send(content);
};

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

    const token = generatePasswordResetToken();

    const expiration = generatePasswordResetExpiryDate();

    await knex("password_reset_tokens").insert({ email, expiration, token, used: false });

    await sendPasswordResetEmail(token, email);

    return response
      .status(200)
      .json({ message: "If an account with this email address exists, we have sent you a password reset email." });
  } catch (error) {
    response.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
