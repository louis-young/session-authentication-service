import { Router } from "express";

import { destroySession } from "../utilities/utilities.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    await destroySession(request.session);

    response.json({ message: "Logged user out." });
  } catch (error) {
    response.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
