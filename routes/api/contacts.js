const express = require("express");

const contactsController = require("../../controllers/contacts-controller");

const { isValidId,authenticate } = require("../../middlewares");

const router = express.Router();

router.get("/", authenticate, contactsController.getAllReq);

router.get("/:contactId", authenticate, isValidId, contactsController.getByIdReq);

router.post("/", authenticate, contactsController.postReq);

router.delete("/:contactId", authenticate, contactsController.deleteReq);

router.put("/:contactId", authenticate, isValidId, contactsController.putReq);

router.patch("/:contactId/favorite", authenticate, isValidId, contactsController.patchReqFavorite);



module.exports = router;