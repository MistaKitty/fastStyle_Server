const { validateReCaptchaToken } = require("../middleware/middleware");

const validateReCaptcha = async (req, res) => {
  const { token, action } = req.body;

  try {
    const result = await validateReCaptchaToken(token, action, req);
    res.json({
      success: true,
      message: "reCAPTCHA validation successfull.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { validateReCaptcha };
