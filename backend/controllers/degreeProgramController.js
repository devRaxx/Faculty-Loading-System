const DEGREE_PROGRAM = require('../models/degreeProgramModel')
const SCHEDULE = require('../models/scheduleModel')
const { schedRawData } = require('../utils/getSchedRawData')
const mongoose = require('mongoose')


const getDegreePrograms = async (req, res) => {
    const { sem } = req.params
    try {
        const semDegreePrograms = await DEGREE_PROGRAM.find({ semester: sem })
        res.status(200).json(semDegreePrograms)

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const createDegreeProgram = async (req, res) => {

    const {
        name,
        yearLevel,
        department
    } = req.body

    const { sem } = req.params
    let emptyFields = []

    if (!name) {
        emptyFields.push('name')
    }
    if (!yearLevel) {
        emptyFields.push('yearLevel')
    }
    if (!department) {
        emptyFields.push('department')
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Invalid Fields: ${emptyFields.map((field)=>field + " ")}` })
    }
    try {
        const createdDegreeProgram = await DEGREE_PROGRAM.create({ ...req.body, semester: sem })
        res.status(200).json(createdDegreeProgram)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}



module.exports = {
    getDegreePrograms,
    createDegreeProgram
}