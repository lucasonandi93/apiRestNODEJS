const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  role: {type: String, enum: ['admin', 'user'], default: 'user'}
},{timestamps: true});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);