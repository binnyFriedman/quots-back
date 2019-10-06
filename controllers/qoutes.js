const Quote = require("../models/Quote");
const exportPDF = require("../helpers/pdfExport");
module.exports = {
  getQuotes: async (req, res, next) => {
    //get email and password
    Quote.find()
      .populate("Services")
      .populate("Sender")
      .exec()
      .then(quots => {
        console.log(quots);

        res.status(200).json({ Quotes: quots });
      })
      .catch(error => {
        res.status(402).json({ error: error });
      });
  },
  getSingleQuote: async (req, res, next) => {
    const id = req.params.id;

    if (!id)
      return res
        .status(403)
        .json({ error: "req must contain the id of the quote" });
    Quote.findById(id)
      .populate("Services")
      .populate("Sender")
      .exec()
      .then(quote => {
        if (!quote) {
          return res.status(404).json("Quote does not exist");
        }
        res.status(200).json({ quote: quote });
      });
  },
  deleteQuote: async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      return res
        .status(500)
        .json({ error: "req must contain the id of the quote" });
    }
    Quote.findByIdAndDelete(id)
      .then(res => {
        return res
          .status(200)
          .json({ message: "deleted Succesfully", res: res });
      })
      .catch(error => {
        return res.status(500).json({ error: error });
      });
  },
  createQuote: async (req, res, next) => {
    let gotServices;
    current_datetime = new Date();
    let created =
      current_datetime.getDate() +
      "/" +
      (current_datetime.getMonth() + 1) +
      "/" +
      current_datetime.getFullYear();
    if (Array.isArray(req.body.Services)) {
      gotServices = [...req.body.Services];
    }

    const newQuote = new Quote({
      created: created,
      Reciever: req.body.Reciever || {},
      Sender: req.user._id,
      Services: gotServices,
      PriceNotes: req.body.PriceNotes,
    });

    newQuote
      .save()
      .then(quote => {
        res.status(200).json({ quote });
      })
      .catch(err => {
        res.status(500).json({ err });
      });
  },
  updateQuote: async (req, res, next) => {
    Quote.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("Services")
      .populate("Sender")
      .exec((error, responce) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: error.message });
        }
        res.status(200).json({ quote: responce });
      });
  },
  exportQuote: async (req, res, next) => {
    const quote = await Quote.findById(req.params.id)
      .populate("Services")
      .populate("Sender")
      .exec();
    if (quote) {
      const result = await exportPDF.pdfExport(quote);
      if (result) {
        return res.status(200).json({ pdf: result.pdf });
      }
      return res.status(500).json({ error: "no result " });
    }
    res.status(404).json({ message: "quote not found" });
  },
};
