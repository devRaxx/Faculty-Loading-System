const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BlocSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  degreeProgram: {
    type: String,
    required: true
  },
  semester: {
    type: String, //The value here must be Semester Specific (Semester ID)
    required: true
  },
  yearLevel: {
    type: Number,
    required: true
  },
  bloc: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Bloc', BlocSchema)