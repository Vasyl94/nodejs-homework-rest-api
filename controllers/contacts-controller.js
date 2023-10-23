const Joi = require("joi");

const Contact = require("../models/contact");

const { HttpErrors } = require("../helpers");

const addSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.number().required(),
  email: Joi.string().required(),
  favorite: Joi.boolean()
});

const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

//
const getAllReq = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const all = await Contact.find({ owner }, "-createdAt -updatedAT", {
      skip,
      limit,
    }).populate("owner", "subscription email");
    res.json(all);
  } catch (error) {
    next(error);
  }
};

const getByIdReq = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const byId = await Contact.findById(contactId);

    if (!byId) {
      throw HttpErrors(404, "Not found");
    }
    res.json(byId);
  } catch (error) {
    next(error);
  }
};

const postReq = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpErrors(400, error.message);
    }
    const { _id: owner } = req.user;
    const add = await Contact.create({ ...req.body, owner });
    res.status(201).json(add);
  } catch (error) {
    next(error);
  }
};

const deleteReq = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const remove = await Contact.findByIdAndRemove(contactId);

    if (!remove) {
      throw HttpErrors(400, "Not found");
    }

    res.json({
      message: "Delete success",
    });
  } catch (error) {
    next(error);
  }
};

const putReq = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw HttpErrors(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpErrors(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const patchReqFavorite = async (req, res, next) => {
  try {
    const { error } = favoriteSchema.validate(req.body);
    if (error) {
      throw HttpErrors(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!result) {
      throw HttpErrors(404, "Not found");
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllReq,
  getByIdReq,
  postReq,
  deleteReq,
  putReq,
  patchReqFavorite,
};