const {
  User,
  validateUser,
  validateID,
  genAuthToken
} = require("../models/users");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin")
const bcrypt = require("bcryptjs");

const routes = function(app) {
  // ****************** GET METHOD ********************** //
  app.get("/api-v1/users", async (req, res) => {
    try {
      const result = await User.find()
        .sort("lastName")
        .sort("firstName")
        .select("-password")
        .select("-__v");
      res.send(result);
    } catch (error) {
      console.log(error);
      res.send(
        "There was an error retrieving the results, please try again later"
      );
    }
  });

  // ****************** POST METHOD ********************* //
  app.post("/api-v1/users", [auth, admin], async (req, res) => {

    const result = validateUser(req.body);
    if (!result.error) {
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const userToAdd = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashed,
        email: req.body.email.toLowerCase(),
        isAdmin: req.body.isAdmin,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip
      });

      try {
        let user = await userToAdd.save();
        const token = genAuthToken(user);
        console.log(token);
        res
          .header("X-Auth-Token", token)
          .status(200)
          .send(token);
      } catch (error) {
        let result = error.message;
        res.send(result);
      }
    } else {
      res.send(result.error);
    }
  });

  // ****************** PUT METHOD ********************** //
  app.put("/api-v1/users", auth, async (req, res) => {
    const result = validateUser(req.body);

    if (!result.error) {
      const password = req.body.password;
      const id = req.body.id;
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      let firstName = req.body.firstName;
      let lastName = req.body.lastName;
      let email = req.body.email.toLowerCase();
      let isAdmin = req.body.isAdmin;
      let address = req.body.address;
      let city = req.body.city;
      let state = req.body.state;
      let zip = req.body.zip;

      try {
        const user = await User.findOneAndUpdate(
          { _id: id },
          {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            password: `${hashed}`,
            email: `${email}`,
            isAdmin: `${isAdmin}`,
            address: `${address}`,
            city: `${city}`,
            state: `${state}`,
            zip: `${zip}`
          },
          { new: true }
        );

        if (!user) {
          res.send("Could not update that user, please validate your data");
        } else {
          res.send(user);
        }
      } catch (error) {
        let result = error.message;
        res.send(result);
      }
    } else {
      res.send(result.error);
    }
  });

  // ****************** DELETE METHOD ******************* //
  app.delete("/api-v1/users/", [auth, admin], async (req, res) => {
    const result = validateID(req.body);

    if (!result.error) {
      const id = req.body.id;
      try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
          res.status(404).send("There was no user with this ID found");
        } else {
          res.send(user);
        }
      } catch (error) {
        res.send(error.message);
      }
    }
  });

  // app.get("/api-v1/users/me", auth, async (req, res) => {
  //   console.log(req.user._id);
  //   const user = await User.findById(req.user._id)
  //     .select("-password")
  //     .select("-__v");
  //   res.send(user);
  // });

  // ****************** GET BY ID METHOD **************** //
  app.get("/api-v1/users/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(404).send("There was no user with this ID found");
      }
    } catch (error) {
      let result = error.message;
      res.send(result);
    }
  });
};

module.exports.routes = routes;
