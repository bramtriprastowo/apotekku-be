const express = require("express")
const router = express.Router()
const usersController = require("../controller/users")
const authenticateToken = require("../middlewares/authenticateToken")

router
// .post("/register", usersController.register)
.post("/login", usersController.login)
.post("/refresh-token", usersController.refreshToken)
.delete("/logout", usersController.logout)
.get("/profile", authenticateToken, usersController.profile)

module.exports = router