import csrf from "csurf";

const useCSRFProtection = (app, { getErrorResponse, debug, cookieRefreshTime = 60000 } = {}) => {
  app.use(
    csrf({
      value: (request) => {
        if (request.get("Content-Type") === "application/x-www-form-urlencoded") {
          return request.body.csrf_token;
        }

        return request.get("X-XSRF-TOKEN");
      },
    })
  );

  app.use((error, request, response, next) => {
    if (error.code !== "EBADCSRFTOKEN") {
      next(error);

      return;
    }

    if (debug) {
      console.log("CSRF failure.");

      if (typeof debug === "function") {
        debug(error, request);
      }
    }

    response.set("X-XSRF-TOKEN", request.csrfToken());

    response.cookie("XSRF-TOKEN", request.csrfToken(), { sameSite: "lax" });

    if (getErrorResponse) {
      getErrorResponse(error, request, response, next);
    } else {
      next(error);
    }
  });

  const attachCSRFCookie = (request, response) => {
    response.cookie("XSRF-TOKEN", request.csrfToken(), { sameSite: "lax" });

    request.session.csrfCookieSet = Date.now();
  };

  app.use((request, response, next) => {
    request.attachCSRFCookie = attachCSRFCookie;

    if (!request.session.csrfCookieSet || request.session.csrfCookieSet < Date.now() - cookieRefreshTime) {
      attachCSRFCookie(request, response);
    }

    next();
  });
};

export default useCSRFProtection;
