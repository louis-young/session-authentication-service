const getCookieValue = (name) => {
  return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";
};

const getCSRFToken = () => {
  return getCookieValue("CSRF-TOKEN");
};

export { getCookieValue, getCSRFToken };
