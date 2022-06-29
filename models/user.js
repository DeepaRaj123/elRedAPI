const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

  _id: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  phone: {
      type: String,
      required: true
  },
  userType: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  userName: {
    type: String,
    required: false
  },
  isAuth: {
    type: Boolean,
    required: true
  },
  gender: {
    type: String,
    required: false
  },
  dob: {
    type: String,
    required: false
  },
  location: {
    type: String,
    required: false
  },
  profession: {
    type: String,
    required: false
  },
  organizationType: {
    type: String,
    required: false
  },
  organizationName: {
    type: String,
    required: false
  },

});

module.exports = mongoose.model('userInfo', userSchema,"userInfo");
