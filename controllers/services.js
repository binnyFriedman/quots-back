const Service = require("../models/Service");

async function findService(serviceName) {
  return await Service.findOne({ name: serviceName });
}

module.exports = {
  getServices: async (req, res, next) => {
    if (req.query.default) {
      const services = await Service.find({ default_Service: true });
      if (!services) {
        return res.status(500).json({ error });
      } else {
        return res.status(200).json({ services });
      }
    }
    if (req.query.servIds) {
      Service.find()
        .where("_id")
        .in(req.query.servIds)
        .exec((error, services) => {
          if (error) {
            return res.status(500).json({ error });
          }

          return res.status(200).json({ services });
        });
    } else {
      Service.find()
        .then(services => {
          return res.status(200).json({ services });
        })
        .catch(err => {
          return res.status(404).json({
            confirmation: "fail",
            message: err.message,
          });
        });
    }
  },

  getService: async (req, res, next) => {
    const id = req.body.id;
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "No such service" });
    }
  },
  updateService: async (req, res, next) => {
    const id = req.params.id;
    Service.findByIdAndUpdate(
      id,
      req.body.updateData,
      (err => {
        return res.status(500).json({ err });
      },
      response => {
        res.status(200).json({ service: response });
      }),
    );
  },
  addService: async (req, res, next) => {
    if (req.body.name) {
      const service = await Service.findOne({ name: req.body.name });
      if (service) {
        console.log(service);

        if (!service.default_Service) {
          Service.findByIdAndUpdate(service._id, req.body, { new: true })
            .then(service => {
              return res.status(200).json({ service });
            })
            .catch(error => {
              return res.status(500).json({ error });
            });
        }
      } else {
        const nServ = new Service({ ...req.body });
        const newServ = await nServ.save();

        console.log(newServ);

        return res.status(200).json({ service: newServ });
      }
    }
  },
  updateService: async (req, res, next) => {
    const id = req.params.id;
    Service.findByIdAndUpdate(id, req.body, (err, response) => {
      if (err) {
        console.log(err);

        return res.status(500).json({ error: err });
      }
      res.status(200).json({ service: response });
    });
  },
};
