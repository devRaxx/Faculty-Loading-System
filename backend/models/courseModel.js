const mongoose = require('mongoose')

const Schema = mongoose.Schema

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  units: {
    type: Number,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Course', courseSchema)