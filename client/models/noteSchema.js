var mongoose = require('mongoose');

var note = new mongoose.Schema({
    owner:String,
    title:String,
    body:String,
    createdOn:Date
});


module.exports = note;