export const getStartTime = (section) => {
  switch (section) {
    case "A":
      return { time: "7:00 AM", day: ["Tuesday", "Thursday"] };
    case "I":
      return { time: "7:00 AM", day: ["Wednesday", "Friday"] };
    case "Q":
      return { time: "7:00 AM", day: ["Monday"] };
    case "B":
      return { time: "8:30 AM", day: ["Tuesday", "Thursday"] };
    case "J":
      return { time: "8:30 AM", day: ["Wednesday", "Friday"] };
    case "R":
      return { time: "8:30 AM", day: ["Monday"] };
    case "C":
      return { time: "10:00 AM", day: ["Tuesday", "Thursday"] };
    case "K":
      return { time: "10:00 AM", day: ["Wednesday", "Friday"] };
    case "S":
      return { time: "10:00 AM", day: ["Monday"] };
    case "D":
      return { time: "11:30 AM", day: ["Tuesday", "Thursday"] };
    case "L":
      return { time: "11:30 AM", day: ["Wednesday", "Friday"] };
    case "T":
      return { time: "11:30 AM", day: ["Monday"] };
    case "E":
      return { time: "1:00 PM", day: ["Tuesday", "Thursday"] };
    case "M":
      return { time: "1:00 PM", day: ["Wednesday", "Friday"] };
    case "U":
      return { time: "1:00 PM", day: ["Monday"] };
    case "F":
      return { time: "2:30 PM", day: ["Tuesday", "Thursday"] };
    case "N":
      return { time: "2:30 PM", day: ["Wednesday", "Friday"] };
    case "V":
      return { time: "2:30 PM", day: ["Monday"] };
    case "G":
      return { time: "4:00 PM", day: ["Tuesday", "Thursday"] };
    case "O":
      return { time: "4:00 PM", day: ["Wednesday", "Friday"] };
    case "W":
      return { time: "4:00 PM", day: ["Monday"] };
    case "H":
      return { time: "5:30 PM", day: ["Tuesday", "Thursday"] };
    case "P":
      return { time: "5:30 PM", day: ["Wednesday", "Friday"] };
    case "X":
      return { time: "5:30 PM", day: ["Monday"] };
    default:
      break;
  }
};

export const getMatchingSection = (sched) => {
  const matchCondition = (obj1, obj2) => {
    return (
      obj1.time === obj2.time &&
      JSON.stringify(obj1.day) === JSON.stringify(obj2.day)
    );
  };

  if (
    matchCondition(sched, { time: "7:00 AM", day: ["Tuesday", "Thursday"] })
  ) {
    return "A";
  } else if (
    matchCondition(sched, { time: "7:00 AM", day: ["Wednesday", "Friday"] })
  ) {
    return "I";
  } else if (matchCondition(sched, { time: "7:00 AM", day: ["Monday"] })) {
    return "Q";
  } else if (
    matchCondition(sched, { time: "8:30 AM", day: ["Tuesday", "Thursday"] })
  ) {
    return "B";
  } else if (
    matchCondition(sched, { time: "8:30 AM", day: ["Wednesday", "Friday"] })
  ) {
    return "J";
  } else if (matchCondition(sched, { time: "8:30 AM", day: ["Monday"] })) {
    return "R";
  } else if (
    matchCondition(sched, { time: "10:00 AM", day: ["Tuesday", "Thursday"] })
  ) {
    return "C";
  } else if (
    matchCondition(sched, { time: "10:00 AM", day: ["Wednesday", "Friday"] })
  ) {
    return "K";
  } else if (matchCondition(sched, { time: "10:00 AM", day: ["Monday"] })) {
    return "S";
  } else if (
    matchCondition(sched, { time: "11:30 AM", day: ["Tuesday", "Thursday"] })
  ) {
    return "D";
  } else if (
    matchCondition(sched, { time: "11:30 AM", day: ["Wednesday", "Friday"] })
  ) {
    return "L";
  } else if (matchCondition(sched, { time: "11:30 AM", day: ["Monday"] })) {
    return "T";
  } else if (
    matchCondition(sched, { time: "1:00 PM", day: ["Tuesday", "Thursday"] })
  ) {
    return "E";
  } else if (
    matchCondition(sched, { time: "1:00 PM", day: ["Wednesday", "Friday"] })
  ) {
    return "M";
  } else if (matchCondition(sched, { time: "1:00 PM", day: ["Monday"] })) {
    return "U";
  } else if (
    matchCondition(sched, { time: "2:30 PM", day: ["Tuesday", "Thursday"] })
  ) {
    return "F";
  } else if (
    matchCondition(sched, { time: "2:30 PM", day: ["Wednesday", "Friday"] })
  ) {
    return "N";
  } else if (matchCondition(sched, { time: "2:30 PM", day: ["Monday"] })) {
    return "V";
  } else if (
    matchCondition(sched, { time: "4:00 PM", day: ["Tuesday", "Thursday"] })
  ) {
    return "G";
  } else if (
    matchCondition(sched, { time: "4:00 PM", day: ["Wednesday", "Friday"] })
  ) {
    return "O";
  } else if (matchCondition(sched, { time: "4:00 PM", day: ["Monday"] })) {
    return "W";
  } else if (
    matchCondition(sched, { time: "5:30 PM", day: ["Tuesday", "Thursday"] })
  ) {
    return "H";
  } else if (
    matchCondition(sched, { time: "5:30 PM", day: ["Wednesday", "Friday"] })
  ) {
    return "P";
  } else if (matchCondition(sched, { time: "5:30 PM", day: ["Monday"] })) {
    return "X";
  } else {
    return null; // Return a default value if no match is found
  }
};

export const generateTimeSlots = (startTime) => {
  const times = [];
  const start = new Date(`2000-01-01 ${startTime}`);
  let currentTime = new Date(start.getTime() + 60 * 60 * 1000); // Adding one hour

  const endTime = new Date(`2000-01-01 7:30 PM`);

  while (currentTime <= endTime) {
    const formattedTime = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    times.push(formattedTime);
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // Adding 30 minutes
  }
  return times;
};
