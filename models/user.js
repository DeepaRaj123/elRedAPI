const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    _id: {
        type: String,
        required: true
      },
  email: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date
});
module.exports = mongoose.model('User', userSchema);
