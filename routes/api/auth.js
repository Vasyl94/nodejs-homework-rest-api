const express = require("express")
const { validateBody } = require("../../decorators")
const {authenticate} = require("../../middlewares")

const router = express.Router()

const {schemas} = require("../../models/user")

const ctrlAuth = require("../../controllers/auth")

router.post("/register" , validateBody(schemas.registerShema), ctrlAuth.register);

router.post("/login", validateBody(schemas.loginShema), ctrlAuth.login)

router.get("/current", authenticate, ctrlAuth.current)

router.post("/logout", authenticate,ctrlAuth.logout)

router.patch("/users", authenticate,  ctrlAuth.patchReqSubscription )

module.exports = router