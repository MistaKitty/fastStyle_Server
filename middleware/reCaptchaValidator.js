const axios = require("axios");

const validateReCaptchaToken = async (token, expectedAction, req) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  console.log("Validating reCAPTCHA token:", token);
  console.log("Expected action:", expectedAction);

  if (!token) {
    console.error("Token is missing.");
    throw new Error("Token is required.");
  }

  // Captura o IP remoto do request
  const remoteIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (!remoteIp) {
    console.error("Remote IP is missing.");
    throw new Error("Remote IP is required.");
  }

  // Log API request parameters
  const params = {
    secret: secretKey,
    response: token,
    remoteip: remoteIp,
  };
  console.log("Sending request to Google reCAPTCHA API with params:", params);

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      { params }
    );

    console.log("reCAPTCHA API response:", response.data);

    const { success, score, action, error_codes: errorCodes } = response.data;

    if (!success) {
      console.error(
        "reCAPTCHA validation failed due to success flag being false:",
        response.data
      );
      throw new Error("reCAPTCHA validation failed.");
    }

    if (action !== expectedAction) {
      console.error(
        "reCAPTCHA validation failed due to action mismatch. Expected:",
        expectedAction,
        "but got:",
        action
      );
      throw new Error("reCAPTCHA action mismatch.");
    }

    if (score < 0.5) {
      console.warn("reCAPTCHA validation failed due to low score:", score);
      throw new Error("reCAPTCHA score too low.");
    }

    console.log("reCAPTCHA validation succeeded:", { success, action, score });
    return { success: true, message: "reCAPTCHA validation successful." };
  } catch (error) {
    console.error("Error during reCAPTCHA validation:", error.message);
    throw new Error(`Error validating reCAPTCHA: ${error.message}`);
  }
};

module.exports = validateReCaptchaToken;
