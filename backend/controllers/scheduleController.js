const SEMESTER = require("../models/semesterModel");
const COURSE = require("../models/courseModel");
const FACULTY = require("../models/facultyModel");
const ROOM = require("../models/roomModel");
const SCHEDULE = require("../models/scheduleModel");
const { sectionPattern } = require("../models/sectionPattern");
const mongoose = require("mongoose");
const LOAD = require("../models/loadModel");
const BLOC = require("../models/blocModel");
const DEGREE_PROGRAM = require("../models/degreeProgramModel");
const { schedRawData } = require("../utils/getSchedRawData");
const {
  allAttributesFilledOrEmptyInList,
} = require("../utils/weeklySchedValidation");

const getSchedule = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return { error: "No such Schedule" };
  }
  try {
    const schedule = await SCHEDULE.findById(id);
    const semesterData = await SEMESTER.findById(schedule.semester);
    const courseData = await COURSE.findById(schedule.course);
    let roomData = "None";
    let facultyData = "None";
    let studentsData = "None";

    if (schedule.room !== "None") {
      roomData = await ROOM.findById(schedule.room);
    }
    if (schedule.faculty !== "None") {
      facultyData = await FACULTY.findById(schedule.faculty);
    }
    console.log(courseData.type);
    console.log(studentsData);
    if (schedule.students.length !== 0) {
      if (courseData.type === "LAB") {
        studentsData = await BLOC.find({ _id: { $in: schedule.students } });
      } else if (courseData.type === "LEC" || courseData.type === "NA") {
        studentsData = await DEGREE_PROGRAM.find({
          _id: { $in: schedule.students },
        });
      }
    }

    const output = {
      semester: semesterData,
      course: courseData,
      room: roomData,
      faculty: facultyData,
      students: studentsData,
    };
    res.status(200).json(output);
  } catch (err) {
    console.log(err);
    res.status(400);
  }
};

const createSchedule = async (req, res) => {
  let { course, section, weeklySchedule, room, faculty, students, remarks } =
    req.body;
  const { sem } = req.params;
  let emptyFields = [];

  if (!course) {
    emptyFields.push("Course");
  }
  if (!allAttributesFilledOrEmptyInList(weeklySchedule)) {
    emptyFields.push("Weekly Schedule");
  }
  if (!room) {
    emptyFields.push("Room");
  }
  if (!faculty) {
    emptyFields.push("Faculty");
  }
  if (students.length === 0) {
    emptyFields.push("Students");
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Please fill in the necessary fields for Schedule Creation:",
      emptyFields,
    });
  }

  try {
    const createdSchedule = await SCHEDULE.create({
      semester: sem,
      course,
      section,
      weeklySchedule,
      room,
      faculty,
      students,
      remarks,
    });
    res.status(200).json(await schedRawData([createdSchedule]));
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const updateSchedule = async (req, res) => {
  let {
    course,
    section,
    weeklySchedule,
    room,
    faculty,
    students,
    remarks,
    _id,
  } = req.body;
  const { sem } = req.params;
  let emptyFields = [];

  if (!course) {
    emptyFields.push("Course");
  }
  if (!allAttributesFilledOrEmptyInList(weeklySchedule)) {
    emptyFields.push("Weekly Schedule");
  }
  if (!room) {
    emptyFields.push("Room");
  }
  if (!faculty) {
    emptyFields.push("Faculty");
  }
  if (students.length === 0) {
    emptyFields.push("Students");
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Please fill in the necessary fields for Schedule Creation:",
      emptyFields,
    });
  }

  try {
    const updatedSchedule = await SCHEDULE.findByIdAndUpdate(
      _id,
      {
        semester: sem,
        course,
        section,
        weeklySchedule,
        room,
        faculty,
        students,
        remarks,
      },
      { new: true }
    );
    console.log(updatedSchedule);
    res.status(200).json(await schedRawData([updatedSchedule]));
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = {
  getSchedule,
  createSchedule,
  updateSchedule,
};
