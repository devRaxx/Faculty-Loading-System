const mongoose = require('mongoose')

const Schema = mongoose.Schema

const loadSchema = new Schema({
  semester: {
    type: String, //The value here must be Semester Specific (Semester ID)
    required: true
  },
  faculty:{
    type: String, //The value here must be Semester Specific (Semester ID)
    required: true
  },
  ALC:{
    type: Number,
    required: true,
    default: 0,
  },
  SLC: {
    type: Number,
    required: true,
    default: 0,
  },
  RLC: {
    type: Number,
    required: true,
    default: 0,
  }
})

module.exports = mongoose.model('Load', loadSchema)