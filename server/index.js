import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectSessionKnex from "connect-session-knex";
import session from "express-session";
import knex from "./knex/knex.js";
import mail from "./mail/mail.js";

import useCSRFProtection from "./middleware/csrf.js";

import register from "./routes/register.js";
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import user from "./routes/user.js";
import forgotPassword from "./routes/forgot-password.js";
import resetPassword from "./routes/reset-password.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(helmet());

const KnexSessionStore = connectSessionKnex(session);

app.use(
  session({
    cookie: {
      httpOnly: true,
      secure: false, // `true` on HTTPS.
      sameSite: "lax",
      maxAge: 1000 * 3600 * 24 * 30,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({ knex }),
  })
);

// useCSRFProtection(app);

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Application listening on port ${PORT}.`));

app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/logout", logout);
app.use("/api/user", user);
app.use("/api/forgot-password", forgotPassword);
app.use("/api/reset-password", resetPassword);
