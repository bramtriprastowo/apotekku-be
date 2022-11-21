const express = require("express")
const buyingRouter = require("./buying")
const sellingRouter = require("./selling")
const router = express.Router()
const usersRouter = require("./users")

router
.use("/users", usersRouter)
.use("/selling", sellingRouter)
.use("/buying", buyingRouter)

module.exports = router