import { Router } from "express";
import { knex } from "../knex/knex.js";
import {
  generatePasswordResetExpiryDate,
  generatePasswordResetToken,
  sendPasswordResetEmail,
} from "../utilities/passwords.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    const { email } = request.body;

    const user = await knex("users").where({ email }).first();

    if (!user) {
      return response.status(200).json({
        message:
          "If we have an account with this email address on record, a password reset email has been sent.",
      });
    }

    await knex("password_reset_tokens").where({ email }).update({ used: true });

    const passwordResetToken = generatePasswordResetToken();

    const passwordResetExpiryDate = generatePasswordResetExpiryDate();

    await knex("password_reset_tokens").insert({
      email,
      expiration: passwordResetExpiryDate,
      token: passwordResetToken,
      used: false,
    });

    await sendPasswordResetEmail(passwordResetToken, email);

    return response.status(200).json({
      message:
        "If we have an account with this email address on record, a password reset email has been sent.",
    });
  } catch (error) {
    // response.status(500).json({ error: "Something went wrong." });
    response.status(500).json({ error: error.message });
  }
});

export default router;
