import { request, response, Router } from "express";
import knex from "../knex/knex.js";
import argon2 from "argon2";

const router = Router();

const regenerateSession = (session) => {
  try {
    return session.regenerate((error) => {
      if (error) {
        throw new Error();
      }

      return session;
    });
  } catch (error) {
    console.error(error.message);
  }
};

const loginUser = async (request, user) => {
  const session = regenerateSession(request.session);

  session.user_id = user.id;

  request.session = session;
  request.user = user;

  return request;
};

/**
 * Register user route.
 *
 * TODO: Validate request data.
 */

router.post("/register", async (request, response) => {
  try {
    const { email, password } = request.body;

    // Check fields are present.
    if (!email || !password) {
      return response.status(400).json({ error: "An email and password are required." });
    }

    // Check if the user exists.
    const userExists = await knex("users").where({ email }).first();

    if (userExists) {
      return response.status(400).json({ error: "A user with this email address already exists." });
    }

    // Check the minimum password length.
    const minimumPasswordLength = 8;

    if (password.length < minimumPasswordLength) {
      return response
        .status(400)
        .json({ error: `A password must be no less than ${minimumPasswordLength} characters.` });
    }

    // Check the maximum password length.
    const maximumPasswordLength = 64;

    if (password.length > maximumPasswordLength) {
      return response
        .status(400)
        .json({ error: `A password must be no more than ${maximumPasswordLength} characters.` });
    }

    // Hash the password.
    const hash = await argon2.hash(password);

    // Insert the user and return the ID and email.
    const user = await knex("users").insert({ email, password: hash }).returning(["id", "email"]);

    // Regenerate the session.
    request.session.regenerate((error) => {
      if (error) {
        throw new Error();
      }
    });

    request.session.userId = user.id;

    // TODO: Find better solution to accessing the 0th index, or to get Knex to return an object.
    response.json({
      message: "Successfully registered and logged user in.",
      user: {
        id: user[0].id,
        email: user[0].email,
      },
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    // Check fields are present.
    if (!email || !password) {
      return response.status(400).json({ error: "An email and password are required." });
    }

    // Check if user exists.
    const user = await knex("users").where({ email }).first();

    if (!user) {
      return response.status(400).json({ error: "Incorrect email and password combination." });
    }

    // Get hash from database (hashed user password).
    const hash = await knex("users").select("password").where({ email }).first();

    // Check if the passwords match.
    const passwordsMatch = await argon2.verify(hash.password, password);

    if (!passwordsMatch) {
      return response.status(400).json({ error: "Incorrect email and password combination." });
    }

    // Regenerate the session.
    request.session.regenerate((error) => {
      if (error) {
        throw new Error();
      }
    });

    request.session.userId = user.id;

    response.json({
      message: "Successfully logged user in.",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

router.get("/", async (request, response) => {
  try {
    const { userId } = request.session;

    if (typeof userId !== "number") {
      return response.status(401).json({ error: "User not authenticated." });
    }

    const user = await knex("users").select("id", "email").where({ id: userId });

    if (!user) {
      return response.status(401).json({ error: "User not authenticated." });
    }

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

export default router;
