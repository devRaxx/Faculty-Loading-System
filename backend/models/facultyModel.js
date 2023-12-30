const mongoose = require('mongoose')

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
  employeeId:{
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Faculty', facultySchema)