'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const userRoutes = require('./routes/user-routes');


var MONGODB_URI =process.env.MONGODB_URI;

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', userRoutes.routes);


mongoose
.connect(MONGODB_URI,{ useNewUrlParser: true,useUnifiedTopology: true})
.then(result => {
  console.log('App is listening on url http://localhost:' + config.port);
  app.listen(process.env.port||config.port);
})
.catch(err => {
  console.log(err);
});
