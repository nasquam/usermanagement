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

  // Calling routes here, first route is for static content
  app.use(express.static("public"));
  users.routes(app);
  auth.routes(app);
  tickets.routes(app);

};

