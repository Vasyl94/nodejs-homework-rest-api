const express = require("express");

const contactsController = require("../../controllers/contacts-controller");

const { isValidId } = require("../../middlewares");

const router = express.Router();

router.get("/", contactsController.getAllReq);

router.get("/:contactId", isValidId, contactsController.getByIdReq);

router.post("/", contactsController.postReq);

router.delete("/:contactId", contactsController.deleteReq);

router.put("/:contactId", isValidId, contactsController.putReq);

router.patch("/:contactId/favorite", isValidId, contactsController.patchReq);

module.exports = router;