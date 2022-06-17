'use strict';
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const config = require('./config');
const employeeRoutes = require('./routes/employee-routes');
const userRoutes = require('./routes/user-routes');


var MONGODB_URI ='mongodb+srv://DeepaAkhil:DeepaAkhil@cluster0.rhr7t.mongodb.net/test?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "mySessions",
});

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', employeeRoutes.routes);
app.use('/', userRoutes.routes);


//app.listen(process.env.port||config.port, () => console.log('App is listening on url http://localhost:' + config.port));

mongoose
  .connect(MONGODB_URI,{ useNewUrlParser: true,useUnifiedTopology: true })
  .then(result => {
    console.log('App is listening on url http://localhost:' + config.port);
        app.listen(process.env.port||config.port);
  })
  .catch(err => {
    console.log(err);
  });
