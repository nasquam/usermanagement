const port = process.env.port || 8000;

const config = require("config");
const express = require("express");
const app = express();
const helmet = require("helmet");
const fs = require("file-system");
const mongoose = require("mongoose");
const users = require('./routes/users');
const auth = require('./routes/auth');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

if(!config.get('jwtPrivateKey')){
  console.log("FATAL ERROR: jwtPrivateKey not defined")
  process.exit(1);
}

const mongoPass = config.get('mongoPassword')

mongoose
  .connect(
    `mongodb+srv://niodbuser:${mongoPass}@nasquam-z7win.mongodb.net/exampleApp?retryWrites=true`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connection to the remote database made..."))
  .catch(err => {
    console.error("Could not connect to MongoDB...", err.stack);
    process.exit(1);
  });

mongoose.set("useCreateIndex", true);

users.routes(app)
auth.routes(app)

app.listen(port);
