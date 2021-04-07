import { Router } from "express";
import { knex } from "../knex/knex.js";

const router = Router();

router.get("/", async (request, response) => {
  try {
    const { userId } = request.session;

    if (typeof userId !== "number") {
      return response.status(401).json({ error: "User not authenticated." });
    }

    const [user] = await knex("users")
      .select("id", "email")
      .where({ id: userId });

    if (!user) {
      return response.status(401).json({ error: "User not authenticated." });
    }

    request.attachCSRFCookie(request, response);

    response.json(user);
  } catch (error) {
    response.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
