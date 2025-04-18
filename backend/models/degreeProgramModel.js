const blocModel = require('./blocModel')
const BLOC = require('./blocModel')
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const degreeProgramSchema = new Schema({
    name: {
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
    department: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('DegreeProgram', degreeProgramSchema)