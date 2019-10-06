const JWT = require("jsonwebtoken");
const User = require("../models/User");

async function findUser(email) {
  return await User.findOne({ email });
}

signToken = user => {
  return JWT.sign(
    {
      iss: "binnyAtNekuda",
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.JWT_SECRET,
  );
};

module.exports = {
  signup: async (req, res, next) => {
    //get email and password
    const { email, password } = req.value.body;
    findUser(email).then(user => {
      if (!user) {
        //email does not exist yet in the system
        const userI = new User({
          method: "local",
          email: email,
          local: {
            password: password,
          },
          displayName: "",
        });
        userI
          .save()
          .then(() => {
            const token = signToken(userI);
            res.status(200).json({ token });
          })
          .catch(error => {
            res.status(403).json({ error: error });
          });
      } else {
        return res.json({
          message:
            "this email is allready taken, please login using " + user.method,
        });
      }
    });
  },
  signin: async (req, res, next) => {
    //Generate token

    const token = signToken(req.user);
    res.status(200).json({ token });
  },

  googleOauth: async (req, res, next) => {
    console.log("got to return statement");

    const token = signToken(req.user);
    res.status(200).json({ token });
  },
 
  getOne: async (req, res, next) => {
    findUser(req.body.email).then(user => {
      if (!user) {
        res.json({
          auth: false,
          message:
            "Sorry we did not find your email registered please contact dev team to solve this",
        });
      } else {
        res.json({
          auth: true,
          message: "Welcome back" + user.name,
        });
      }
    });
  },
  byid: async (req, res, next) => {
    res.status(200).json({ user: req.user });
  },
  updateuser: async (req, res, next) => {
    // let where = Object.keys(req.body);
    // console.log(where);
    req.user.toObject();
    req.user.displayName = req.body.displayName;
    let updatedUser = await req.user.save();
    // const updatedUser = await User.findByIdAndUpdate(
    //   req.user._id,
    //   { new: true },
    //   req.body,
    // );
    if (!updatedUser) {
      console.log(err);
      res.status(500).json({ err });
    }
    console.log(updatedUser);
    res.status(200).json({ message: "user updated successfully" });
  },
};
