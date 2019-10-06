const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Quote Stucture
const QuoteSchema = new Schema({
  created: {
    type: String,
  },
  Reciever: {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    logo: {
      type: String,
    },
  },
  Sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  SenderSpecial: {
    displayName: {
      type: String,
    },
    email: {
      type: String,
    },
  },

  Services: [
    {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  PriceNotes: {
    type: Object,
  },
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Quote", QuoteSchema, "qoutes");
