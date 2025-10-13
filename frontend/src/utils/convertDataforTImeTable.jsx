export const convertToFacultyTimeTableData = (
  facultySchedule,
  selectedFacultyId
) => {
  if (!selectedFacultyId) {
    return [];
  }

  let convertedData = [];

  facultySchedule.forEach((item) => {
    item.schedule.forEach((schedule) => {
      const { day, section, startTime, endTime } = schedule;

      if (Array.isArray(day)) {
        day.forEach((singleDay) => {
          const convertedItem = {
            day: singleDay,
            subject: item.course.code,
            section,
            start: startTime,
            end: endTime,
            subjectRendered: false,
            sectionRendered: false,
          };

          convertedData.push(convertedItem);
        });
      } else {
        const convertedItem = {
          day,
          subject: item.course.code,
          section,
          start: startTime,
          end: endTime,
          subjectRendered: false,
          sectionRendered: false,
        };

        convertedData.push(convertedItem);
      }
    });
  });

  convertedData = convertedData.flat();

  console.log(convertedData);
  return convertedData;
};

export const convertToSectionTimeTableData = (schedules) => {
  if (!schedules || schedules.length === 0) return [];

  let convertedData = [];

  schedules.forEach((item) => {
    item.schedule.forEach((schedule) => {
      const { day, section, startTime, endTime } = schedule;

      if (Array.isArray(day)) {
        day.forEach((singleDay) => {
          convertedData.push({
            day: singleDay,
            subject: item.course.code,
            section,
            start: startTime,
            end: endTime,
            courseType: item.course.type,
            bloc: item.students?.[0]?.bloc || "1",
            facultyLastName: item.faculty?.lastName || "",
            subjectRendered: false,
            sectionRendered: false,
            ficRendered: false,
          });
        });
      } else {
        convertedData.push({
          day,
          subject: item.course.code,
          section,
          start: startTime,
          end: endTime,
          courseType: item.course.type,
          bloc: item.students?.[0]?.bloc || "1",
          facultyLastName: item.faculty?.lastName || "",
          subjectRendered: false,
          sectionRendered: false,
          ficRendered: false,
        });
      }
    });
  });

  return convertedData.flat();
};
