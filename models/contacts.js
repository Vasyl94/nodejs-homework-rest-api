const { Schema, model } = require("mongoose");
const { HandleMongoose } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
  }, { versionKey: false, timestamps: true }
);

contactSchema.post("save", HandleMongoose);

const Contact = model("contact", contactSchema);

module.exports = Contact;
