const mongoose = require('mongoose')
const LOAD = require('./loadModel')
const Schema = mongoose.Schema

const facultySchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  semester: {
    type: String, //The value here must be Semester Specific (Semester ID)
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Faculty', facultySchema)