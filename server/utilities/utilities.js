import zxcvbn from "zxcvbn";

const regenerateSession = (session) => {
  return new Promise((resolve, reject) => {
    session.regenerate((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

const checkPasswordValidity = (password) => {
  const result = zxcvbn(password);

  const score = result.score;

  const feedback = result.feedback.suggestions.join();

  if (score <= 2) {
    return { valid: false, feedback };
  }

  return { valid: true };
};

export { regenerateSession, checkPasswordValidity };
