const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    short_content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    meta_title: {
      type: String,
      default: "",
    },

    meta_description: {
      type: String,
      default: "",
    },

    meta_keyword: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", blogSchema);