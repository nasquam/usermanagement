const mongoose = require("mongoose");
const config = require("config");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey not defined");
  process.exit(1);
}

module.exports = function() {
  const mongoPass = config.get("mongoPassword");

  mongoose
    .connect(
      //`mongodb+srv://niodbuser:${mongoPass}@nasquam-z7win.mongodb.net/exampleApp?retryWrites=true`,
      `mongodb://localhost:27017/UserManagement`,
      { useNewUrlParser: true }
    )
    .then(() => console.log("Connection to the database made..."))
    .catch(err => {
      console.error("Could not connect to MongoDB...", err.stack);
      process.exit(1);
    });

  mongoose.set("useCreateIndex", true);
};
