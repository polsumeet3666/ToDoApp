var mongoose = require('mongoose');

var user = new mongoose.Schema({
    firstname:String,
    email:String,
    password:String
})

module.exports = user;