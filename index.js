import express from "express";
import dotenv from "dotenv";
import users from "./routes/users.js";
import session from "express-session";
import connectSessionKnex from "connect-session-knex";
import knex from "./knex/knex.js";

dotenv.config();

const app = express();

const KnexSessionStore = connectSessionKnex(session);

const store = new KnexSessionStore({ knex });

// app.set('trust proxy', 1); // Set with proxy.

app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false, // `true` on HTTPS.
      sameSite: "lax",
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}.`));

app.use("/users", users);
