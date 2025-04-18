const COURSE = require('../models/courseModel')
const FACULTY = require('../models/facultyModel')
const LOAD = require('../models/loadModel')
const SCHEDULE = require('../models/scheduleModel')

const getSummary = async (req, res) => {
    const { semId } = req.params
    try {
        const semesterFaculties = await FACULTY.find({ semester: semId }, { _id: 1 })
        const semesterSchedules = await SCHEDULE.find({ semester: semId })

        function getCoursesByFaculty(semesterScheds, facultyList) {
            const facultyMap = {}
            facultyList.map(({ _id }) => facultyMap[_id.toString()] = []);

            semesterScheds.forEach(item => {
                const facultyId = item.faculty;
                const courseId = item.course;

                if (!facultyMap[facultyId]) {
                    facultyMap[facultyId] = [];
                }
                facultyMap[facultyId].push(courseId);
            });

            const result = [];
            console.log(facultyMap)
            for (const facultyId in facultyMap) {
                result.push({ faculty: facultyId, courses: facultyMap[facultyId] });
            }

            return result;
        }

        // Output array of objects with faculty id and courses specific to that faculty
        const outputArray = getCoursesByFaculty(semesterSchedules, semesterFaculties);
        console.log(outputArray)
        const facultyLoad = await Promise.all(outputArray.map(async ({ faculty, courses }) => {
            const unitsMap = {};
            if (courses.length > 0) {
                courses.forEach(async (id) => {
                    if (!unitsMap[faculty]) {
                        unitsMap[faculty] = 0;
                    }
                    const unit = await COURSE.findOne({ _id: id }, { units: 1, _id: 0 });
                    unitsMap[faculty] += unit.units;

                })
            }else{
                unitsMap[faculty] = 0;
            }

            const loadData = await LOAD.findOne({ semester: semId, faculty: faculty })
            const facultyData = await FACULTY.findById(faculty)
            return {
                firstName: facultyData.firstName,
                lastName: facultyData.lastName,
                employeeId: facultyData.employeeId,
                TLC: unitsMap[faculty],
                ALC: loadData.ALC,
                SLC: loadData.SLC,
                RLC: loadData.RLC
            }
        }))

        // console.log(semesterSchedules)
        res.status(200).json(facultyLoad)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    getSummary
}