export const convertToFacultyTimeTableData = (
  facultySchedule,
  selectedFacultyId
) => {
  if (!selectedFacultyId) {
    return [];
  }

  // Initialize an empty array to store the converted format
  let convertedData = [];

  // Iterate through the filteredData array
  facultySchedule.forEach((item) => {
    // Iterate through the schedule array in each item
    item.schedule.forEach((schedule) => {
      // Extract necessary information from the schedule object
      const { day, section, startTime, endTime } = schedule;

      // If the schedule day is an array, split it into separate objects
      if (Array.isArray(day)) {
        // Iterate through each day in the array
        day.forEach((singleDay) => {
          // Construct the object for each single day
          const convertedItem = {
            day: singleDay,
            subject: item.course.code, // Assuming course code represents the subject
            section,
            start: startTime,
            end: endTime,
            subjectRendered: false,
            sectionRendered: false,
          };

          // Push the converted item to the convertedData array
          convertedData.push(convertedItem);
        });
      } else {
        // If the schedule day is not an array, construct the object normally
        const convertedItem = {
          day,
          subject: item.course.code, // Assuming course code represents the subject
          section,
          start: startTime,
          end: endTime,
          subjectRendered: false,
          sectionRendered: false,
        };

        // Push the converted item to the convertedData array
        convertedData.push(convertedItem);
      }
    });
  });

  // Flatten the array of arrays into a single array of objects
  convertedData = convertedData.flat();

  // Output the converted data
  console.log(convertedData);
  return convertedData;
};
