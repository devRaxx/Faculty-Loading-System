const FACULTY = require('../models/facultyModel')
const LOAD = require('../models/loadModel')
const SCHEDULE = require('../models/scheduleModel')
const { schedRawData } = require('../utils/getSchedRawData')
const mongoose = require('mongoose')
const getFacultySchedule = async (req, res) => {
    const { semId } = req.params
    const { facultyId } = req.body
    try {
        const facultyData = await SCHEDULE.find({ faculty: facultyId, semester: semId, isDeleted: false })
        const schedData = await schedRawData(facultyData)
        res.status(200).json(schedData)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const getSemFaculty = async (req, res) => {
    const { semId } = req.params
    try {
        const facultyData = await FACULTY.findAndGetLoad({ semester: semId })
        const semesterSchedules = await schedRawData(await SCHEDULE.find({ semester: semId }))
        console.log("this", semesterSchedules)
        function getCoursesByFaculty(semesterScheds, facultyList) {
            const facultyMap = {}
            const facultyDetailsMap = {}
            facultyList.map((details) => { facultyMap[details._id.toString()] = []; facultyDetailsMap[details._id.toString()] = details });
            semesterScheds.forEach(item => {
                const facultyId = item.faculty._id.toString();
                const course = item;

                if (!facultyMap[facultyId]) {
                    facultyMap[facultyId] = [];
                }
                facultyMap[facultyId].push(course);
            });

            const result = [];
            for (const facultyId in facultyMap) {
                result.push({ faculty: facultyDetailsMap[facultyId], schedules: facultyMap[facultyId] });
            }

            return result;
        }
        const result = getCoursesByFaculty(semesterSchedules, facultyData)
        console.log(result)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

const updateFaculty = async(req,res) => {
    const{
        ALC,
        SLC,
        RLC,
        _id
    } = req.body;

    const { sem } = req.params
    try {
        const updatedFaculty = await FACULTY.findOneAndUpdate({_id: _id, semester: sem},{ALC: !ALC ? 0 : ALC , SLC: !SLC ? 0 : SLC, RLC: !RLC ? 0 : RLC}, {new: true})
        return res.status(200).json(updatedFaculty)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }

}

const createFaculty = async (req, res) => {
    const {
        firstName,
        lastName,
        employeeId,
        department
    } = req.body;

    const { sem } = req.params
    const emptyFields = []
    if (!firstName) {
        emptyFields.push("First Name");
    }
    if (!lastName) {
        emptyFields.push("Last Name");
    }
    if (!employeeId) {
        emptyFields.push("Employee ID");
    }
    if (!department) {
        emptyFields.push("Department");
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ error: `Invalid Fields : ${emptyFields.map((field) => field + " ")}` })
    }

    try {
        const createdFaculty = await FACULTY.create({...req.body, semester: sem})
        return res.status(200).json(createdFaculty)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

module.exports = {
    createFaculty,
    getFacultySchedule,
    getSemFaculty,
    updateFaculty
}