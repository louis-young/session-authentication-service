import { Router } from "express";

import { regenerateSession } from "../utilities/utilities.js";

const router = Router();

router.post("/", async (request, response) => {
  try {
    await regenerateSession(request.session);

    request.attachCSRFCookie(request, response);

    response.json({ message: "Logged user out." });
  } catch (error) {
    console.log(console.error);
    response.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
