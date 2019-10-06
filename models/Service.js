const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//single service
const ServiceSchema = new Schema({
  default_Service: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    trim: true,
    default: "",
    unique: true,
    required: [true, "Name is required"],
  },
  icon: {
    type: String,
  },
  organic: {
    type: Boolean,
    default: false,
  },
  campaign: {
    trim: true,
    type: Boolean,
    default: false,
  },

  content: {
    header: {
      type: String,
      default: "",
      trim: true,
      required: [true, "Content header is required"],
    },
    body: [
      {
        value: {
          type: String,
          trim: true,
        },
      },
    ],
    priceBlock: {
      notes: {
        trim: true,
        type: String,
        default: "",
      },
      header: {
        trim: true,
        type: String,
        default: "",
      },
      price: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        trim: true,
        default: "",
      },
      monthly: {
        type: Boolean,
        default: true,
      },
    },
  },
});

module.exports = mongoose.model("Service", ServiceSchema, "services");
