export const convertToBlocTimeTableData = (blocSchedule, selectedBlocId) => {
  if (!selectedBlocId || !blocSchedule || blocSchedule.length === 0) {
    return [];
  }

  let convertedData = [];

  blocSchedule.forEach((item) => {
    if (item.blocId !== selectedBlocId) return; // Ensure it's the correct bloc

    item.schedule.forEach((schedule) => {
      const { day, section, startTime, endTime } = schedule;

      if (Array.isArray(day)) {
        day.forEach((singleDay) => {
          convertedData.push({
            day: singleDay,
            subject: item.course?.code || "Unknown", // Default to avoid crashes
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
          subject: item.course?.code || "Unknown",
          section,
          start: startTime,
          end: endTime,
          subjectRendered: false,
          sectionRendered: false,
        });
      }
    });
  });

  console.log("Converted Bloc Data:", convertedData);
  return convertedData;
};
