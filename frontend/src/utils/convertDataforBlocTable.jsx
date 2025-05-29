export const convertToBlocTimeTableData = (blocSchedule, selectedBlocId) => {
  console.log("Bloc Schedule:", blocSchedule);
  if (!selectedBlocId || !blocSchedule || blocSchedule.length === 0) {
    return [];
  }

  let convertedData = [];

  blocSchedule.schedules.forEach((schedule) => {
    const { day, section, startTime, endTime } = schedule.weeklySchedule[0];

    if (Array.isArray(day)) {
      day.forEach((singleDay) => {
        convertedData.push({
          day: singleDay,
          subject: blocSchedule.course?.code || "Unknown",
          section,
          start: startTime,
          end: endTime,
          subjectRendered: false,
          sectionRendered: false,
        });
      });
    } else {
      convertedData.push({
        day,
        subject: blocSchedule.course?.code || "Unknown",
        section,
        start: startTime,
        end: endTime,
        subjectRendered: false,
        sectionRendered: false,
      });
    }
  });

  console.log("Converted Bloc Data:", convertedData);
  return convertedData;
};
