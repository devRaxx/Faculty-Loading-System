const mongoose = require('mongoose')

const Schema = mongoose.Schema

const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  building: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Room', roomSchema)