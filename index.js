const port = process.env.port || 8000;
const express = require("express");
const app = express();

require('./startup/routes')(app);
require('./startup/db')();

app.listen(port);
