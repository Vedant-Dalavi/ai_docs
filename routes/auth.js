const express = require("express")
const { signup, login, updateProfile } = require("../controllers/auth")

const router = express.Router()

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-profile", updateProfile)

module.exports = router