const pool = require("../config/db");

const validateUser = async (req, res) => {
  try {

    const { email, mobile } = req.body;

    if (!email || !mobile) {
      return res.status(400).json({
        message: "Email and mobile are required"
      });
    }

    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format"
      });
    }

    const mobileRegex = /^\d{10}$/;

    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        message: "Mobile must be exactly 10 digits"
      });
    }

    const [users] = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      OR mobile = ?
      `,
      [email, mobile]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const user = users[0];

    if (user.status !== "Active") {
      return res.status(403).json({
        message: "User is not active"
      });
    }

    return res.status(200).json({
      message: "Validation successful",
      user
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  validateUser
};