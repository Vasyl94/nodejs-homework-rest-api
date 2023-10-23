const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const Joi = require("joi");

const { User } = require("../models/user");

const { HttpErrors } = require("../helpers");

const { SECRET_KEY } = process.env;

const avatarDes = path.join(__dirname, "../", "public", "avatars");

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpErrors(409, `Sorry but ${email} already exist`);
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw HttpErrors(401, "Email or password invalid");
    }

    const passwordCompare = bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw HttpErrors(401, "Email or password invalid");
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    console.log(await User.findByIdAndUpdate(_id, { token: "" }));
    res.json({
      message: "Logout success",
    });
  } catch (error) {
    next(error);
  }
};

const patchReqSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;

    const { _id } = req.user;

    await User.findByIdAndUpdate(_id, req.body, { new: true });

    const { error } = subscriptionSchema.validate(req.body);
    if (error) {
      throw HttpErrors(400, error.message);
    }

    res.json({
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const patchAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tmpUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarDes, filename);
  await fs.rename(tmpUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

Jimp.read(`${avatarDes}/${filename}`,(err,fileAvatar) => {
  if (err) throw err
  fileAvatar
  .cover(250,250)
  .write(`${avatarDes}/${filename}`) 
})

  res.json({
    avatarURL,
  });
};

module.exports = {
  register,
  login,
  current,
  logout,
  patchReqSubscription,
  patchAvatar,
};