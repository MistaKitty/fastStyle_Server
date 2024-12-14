const axios = require("axios");

const validateReCaptchaToken = async (token, expectedAction) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!token) {
    throw new Error("Token is required.");
  }

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    const { success, score, action, error_codes: errorCodes } = response.data;

    if (!success || action !== expectedAction || score < 0.5) {
      throw new Error(
        `reCAPTCHA validation failed: ${
          errorCodes ? errorCodes.join(", ") : "Unknown error"
        }`
      );
    }

    return { success: true, message: "reCAPTCHA validation successful." };
  } catch (error) {
    throw new Error(`Error validating reCAPTCHA: ${error.message}`);
  }
};

module.exports = validateReCaptchaToken;
