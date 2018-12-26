const { User, validateAuth, genAuthToken } = require("../models/users");
const bcrypt = require("bcryptjs");

const routes = function(app) {
  app.post("/api-v1/auth", async (req, res) => {
    const result = validateAuth(req.body);

    if (!result.null) {
      const email = req.body.email;
      try {
        const user = await User.findOne({ email: email });
        const isValid = await bcrypt.compare(req.body.password, user.password);

        if (isValid) {
          const token = genAuthToken(user);
          res
            .header("X-Auth-Token", token)
            .status(200)
            .send(token);
        }

        if (!isValid) {
          res
            .status(400)
            .send("Could not authenticate that user, please try again");
        }
      } catch (error) {
        res
          .status(400)
          .send("Could not authenticate that user, please try again");
      }
    } else {
      res
        .status(500)
        .send(
          "There was an error retrieving the results, please try again later"
        );
    }
  });
};

module.exports.routes = routes;
