import zxcvbn from "zxcvbn";
import crypto from "crypto";
import { mail } from "../mail/mail.js";

export const generatePasswordResetToken = () => {
  const randomBytes = crypto.randomBytes(64).toString("base64");

  const passwordResetToken = randomBytes
    .replace(/\//g, "_")
    .replace(/\+/g, "-");

  return passwordResetToken;
};

export const generatePasswordResetExpiryDate = () => {
  const passwordResetExpiryDate = new Date();

  passwordResetExpiryDate.setHours(passwordResetExpiryDate.getHours() + 2);

  return passwordResetExpiryDate;
};

export const sendPasswordResetEmail = (passwordResetToken, email) => {
  const passwordResetLink = `${process.env.CLIENT_BASE_URL}/reset-password?token=${passwordResetToken}&email=${email}`;

  const content = {
    to: email,
    from: process.env.MAIL_FROM_ADDRESS,
    subject: "Password reset",
    text: `Please visit ${passwordResetLink} to reset your password.`,
    html: `<p>Please click <a href="${passwordResetLink}" target="_blank">here</a> to reset your password.</p>
             <p>If you didn't request this, please ignore this email.</p>`,
  };

  return mail.send(content);
};

export const sendPasswordResetConfirmationEmail = (email) => {
  const content = {
    to: email,
    from: process.env.MAIL_FROM_ADDRESS,
    subject: "Your password has been reset",
    text:
      "Your password has successfully been reset. If you didn't request this, please immediately reset your password.",
    html: `<p>Your password has successfully been reset.</p>
             <p>If you didn't request this, please immediately reset your password.</p>`,
  };

  return mail.send(content);
};

export const checkPasswordValidity = (password) => {
  const result = zxcvbn(password);

  const score = result.score;

  const feedback = result.feedback.suggestions.join();

  if (score <= 2) {
    return { valid: false, feedback };
  }

  return { valid: true };
};
