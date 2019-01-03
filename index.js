const port = process.env.port || 8000;

const express = require("express");
const app = express();

require('./startup/db')();
require('./startup/routes')(app);

app.listen(port);
