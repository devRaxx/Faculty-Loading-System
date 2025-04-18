const COURSE = require("../models/courseModel");
const BLOC = require("../models/blocModel");
const DEGREE_PROGRAM = require("../models/degreeProgramModel");
const FACULTY = require("../models/facultyModel");
const ROOM = require("../models/roomModel");
const schedRawData = async (sched) => {
  const schedData = await Promise.all(
    sched.map(
      async ({
        course,
        section,
        weeklySchedule,
        room,
        faculty,
        students,
        remarks,
        _id,
      }) => {
        let courseData = "None";
        let roomData = "None";
        let facultyData = "None";
        let studentsData = "None";
        try {
          courseData = await COURSE.findOne({ _id: course, isDeleted: false });
        } catch (error) {
          courseData = null;
        }
        if (room != "None") {
          try {
            roomData = await ROOM.findOne({ _id: room, isDeleted: false });
          } catch (error) {
            roomData = null;
          }
        }
        if (faculty != "None") {
          try {
            facultyData = await FACULTY.findOne({
              _id: faculty,
              isDeleted: false,
            });
          } catch (error) {
            facultyData = null;
          }
        }
        if (students.length != 0) {
          try {
            if (courseData.type == "LAB") {
              studentsData = await BLOC.find({ _id: { $in: students } });
            }
            if (courseData.type == "LEC" || courseData.type == "NA") {
              studentsData = await DEGREE_PROGRAM.find({
                _id: { $in: students },
              });
            }
          } catch (error) {
            studentsData = null;
          }
        }
        const output = {
          _id: _id,
          course: courseData,
          room: roomData,
          faculty: facultyData,
          students: studentsData,
          schedule: weeklySchedule,
          section: section,
          remarks: remarks,
        };
        return output;
      }
    )
  );
  return schedData;
};

module.exports = {
  schedRawData,
};
