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

const isValidPassword = (password) => {
  const minimumPasswordLength = 8;

  if (password.length < minimumPasswordLength) {
    return false;
  }

  const passwordScore = zxcvbn(password).score;

  if (passwordScore < 2) {
    return false;
  }

  return true;
};

export { regenerateSession, isValidPassword };
