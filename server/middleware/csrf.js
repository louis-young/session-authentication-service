import csrf from "csurf";

export const useCSRFProtection = (app, { cookieRefreshTime = 60000 } = {}) => {
  app.use(
    csrf({
      value: (request) => request.get("X-CSRF-TOKEN"),
    })
  );

  app.use((error, request, response, next) => {
    if (error.code !== "EBADCSRFTOKEN") {
      return next(error);
    }

    response.set("X-CSRF-TOKEN", request.csrfToken());

    response.cookie("CSRF-TOKEN", request.csrfToken(), { sameSite: "lax" });

    next(error);
  });

  const attachCSRFCookie = (request, response) => {
    response.cookie("CSRF-TOKEN", request.csrfToken(), { sameSite: "lax" });

    request.session.csrfCookieSet = Date.now();
  };

  app.use((request, response, next) => {
    request.attachCSRFCookie = attachCSRFCookie;

    if (
      !request.session.csrfCookieSet ||
      request.session.csrfCookieSet < Date.now() - cookieRefreshTime
    ) {
      attachCSRFCookie(request, response);
    }

    next();
  });
};
