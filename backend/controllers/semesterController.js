const SEMESTER = require("../models/semesterModel");
const SCHEDULE = require("../models/scheduleModel");
const COURSE = require("../models/courseModel");
const DEGREE_PROGRAM = require("../models/degreeProgramModel");
const BLOC = require("../models/blocModel");
const FACULTY = require("../models/facultyModel");
const ROOM = require("../models/roomModel");
const USER = require("../models/userModel");
const { schedRawData } = require("../utils/getSchedRawData");
const mongoose = require("mongoose");
const LOAD = require("../models/loadModel");

const createSemester = async (req, res) => {
  const { semesterType, AY, userId } = req.body;
  try {
    const createdSemester = await SEMESTER.create({
      semesterType,
      AY,
      modifiedBy: userId,
    });
    const Username = await USER.findById({ _id: userId }, { userName: 1 });
    createdSemester.modifiedBy = Username.userName;
    res.status(200).json(createdSemester);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const copySemester = async (req, res) => {
  const { targetSemesterId, currentSemesterId } = req.body;

  try {
    const facultyCopy = await FACULTY.find({ semester: targetSemesterId });
    console.log("Original Faculty");
    const newFacultyDocs = Promise.all(
      facultyCopy.map(async (doc) => {
        const copy = {
          ...doc.toObject(),
          semester: currentSemesterId,
          previousId: doc._id,
        };
        delete copy._id;
        const createdFaculty = await FACULTY.create(copy);
        return { ...createdFaculty._doc, previousId: doc._id };
      })
    );

    const degreeProgramCopy = await DEGREE_PROGRAM.find({
      semester: targetSemesterId,
    });
    console.log(degreeProgramCopy);
    const newDegreeProgramDocs = Promise.all(
      degreeProgramCopy.map(async (doc) => {
        const copy = {
          ...doc.toObject(),
          semester: currentSemesterId,
          previousId: doc._id,
        };
        delete copy._id;
        const createdDegreeProgram = await DEGREE_PROGRAM.create(copy);
        return { ...createdDegreeProgram._doc, previousId: doc._id };
      })
    );

    const blocsCopy = await BLOC.find({ semester: targetSemesterId });
    const newBlocDocs = Promise.all(
      blocsCopy.map(async (doc) => {
        const copy = {
          ...doc.toObject(),
          degreeProgram: (await newDegreeProgramDocs).find(
            (obj) => obj.previousId == doc.degreeProgram
          )._id,
          semester: currentSemesterId,
          previousId: doc._id,
        };
        delete copy._id;
        const createdBloc = await BLOC.create(copy);
        return { ...createdBloc._doc, previousId: doc._id };
      })
    );

    const courseCopy = await COURSE.find({ semester: targetSemesterId });
    const newCourseDocs = Promise.all(
      courseCopy.map(async (doc) => {
        const copy = {
          ...doc.toObject(),
          semester: currentSemesterId,
          previousId: doc._id,
        };
        delete copy._id;
        const createdCourse = await COURSE.create(copy);
        console.log(createdCourse);
        return { ...createdCourse._doc, previousId: doc._id };
      })
    );
    console.log("Final Courses Copy: ", await newCourseDocs);

    const roomCopy = await ROOM.find({ semester: targetSemesterId });
    const newRoomDocs = Promise.all(
      roomCopy.map(async (doc) => {
        const copy = {
          ...doc.toObject(),
          semester: currentSemesterId,
          previousId: doc._id,
        };
        delete copy._id;
        const createdRoom = await ROOM.create(copy);
        return { ...createdRoom._doc, previousId: doc._id };
      })
    );

    const schedCopy = await SCHEDULE.find({ semester: targetSemesterId });
    const newSchedDocs = Promise.all(
      schedCopy.map(async (doc) => {
        const copy = {
          ...doc.toObject(),
          course: (await newCourseDocs).find(
            (obj) => obj.previousId == doc.course
          )?._id,
          room: (await newRoomDocs).find((obj) => obj.previousId == doc.room)
            ?._id,
          faculty: (await newFacultyDocs).find(
            (obj) => obj.previousId == doc.faculty
          )?._id,
          students: await Promise.all(
            doc.students.map(async (e) => {
              return (
                (await newDegreeProgramDocs)
                  .find((degree) => degree.previousId.toString() == e)
                  ?._id.toString() ||
                (await newBlocDocs)
                  .find((bloc) => bloc.previousId.toString() == e)
                  ?._id.toString()
              );
            })
          ),
          semester: currentSemesterId,
          previousId: doc._id,
        };
        delete copy._id;
        const createdSchedule = await SCHEDULE.create(copy);
        return { ...createdSchedule._doc, previousId: doc._id };
      })
    );

    res.status(200).json({});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllSemester = async (req, res) => {
  try {
    const allSemester = await SEMESTER.find(
      {},
      { _id: 1, semesterType: 1, AY: 1, modifiedBy: 1, dateModified: 1 }
    );
    const semData = await Promise.all(
      allSemester.map(async (sem) => {
        try {
          const userName = await USER.findById(sem.modifiedBy, {
            userName: 1,
            _id: 0,
          });
          sem.modifiedBy = userName.userName;
          return sem;
        } catch (err) {
          return sem;
        }
      })
    );
    res.status(200).send(semData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getSemesterInformation = async (req, res) => {
  const { sem } = req.params;
  const schedules = [],
    courses = [],
    rooms = [],
    faculties = [],
    blocs = [],
    degreePrograms = [];
  try {
    const semesterSchedules = await SCHEDULE.find({
      semester: sem,
      isDeleted: false,
    });
    const ScheduleData = await schedRawData(semesterSchedules);
    schedules.push(...ScheduleData);

    const semesterRooms = await ROOM.find({ semester: sem });
    rooms.push(...semesterRooms);

    const semesterCourses = await COURSE.find({ semester: sem });
    courses.push(...semesterCourses);

    const semesterFaculty = await FACULTY.find({ semester: sem });
    faculties.push(...semesterFaculty);

    const semesterBloc = await BLOC.find({ semester: sem });
    blocs.push(...semesterBloc);

    const semesterDegreePrograms = await DEGREE_PROGRAM.find({ semester: sem });
    degreePrograms.push(...semesterDegreePrograms);

    res
      .status(200)
      .json({ schedules, courses, rooms, faculties, blocs, degreePrograms });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteSemester = async (req, res) => {
  const { id } = req.body;
  await SEMESTER.deleteMany({ _id: id });
  res.status(200).send("Sem Deleted");
};

module.exports = {
  createSemester,
  deleteSemester,
  getAllSemester,
  copySemester,
  getSemesterInformation,
};
