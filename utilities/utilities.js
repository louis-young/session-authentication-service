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

const destroySession = (session) => {
  return new Promise((resolve, reject) => {
    session.destroy((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export { regenerateSession, destroySession };
