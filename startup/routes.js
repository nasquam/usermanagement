const express = require("express");
const helmet = require("helmet");

// requiring routes here
const users = require("../routes/users");
const auth = require("../routes/auth");
const tickets = require("../routes/tickets");

module.exports = function(app) {
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));

  // Calling routes here
  users.routes(app);
  auth.routes(app);
  tickets.routes(app);

};

