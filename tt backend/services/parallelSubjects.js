function key(value) {
  return String(value || "").toUpperCase().replace(/[^A-Z0-9]+/g, " ").trim();
}

const ECS_SEM5_PARALLEL_PAIRS = [
  ["Image Processing and Computer Vision", "Design and Analysis of Algorithms"],
  ["Robot Programming", "Embedded Systems for IOT"],
  ["Robot Programming Lab", "Embedded Systems for IOT Lab"]
];

function prepareSubjectsForTimetable(subjects, department, semester) {
  const prepared = subjects.map((subject) => ({ ...subject }));
  if (department !== "ECS" || Number(semester) !== 5) return prepared;

  for (const [leftName, rightName] of ECS_SEM5_PARALLEL_PAIRS) {
    const leftIndex = prepared.findIndex((subject) => key(subject.name) === key(leftName));
    const rightIndex = prepared.findIndex((subject) => key(subject.name) === key(rightName));
    if (leftIndex < 0 || rightIndex < 0) continue;

    const left = prepared[leftIndex];
    const right = prepared[rightIndex];
    if (Number(left.hoursPerWeek) !== Number(right.hoursPerWeek)
      || key(left.type) !== key(right.type)) continue;

    prepared[leftIndex] = {
      ...left,
      name: `${left.name} / ${right.name}`,
      faculty: [left.faculty, right.faculty].filter(Boolean).join(" / ")
    };
    prepared.splice(rightIndex, 1);
  }

  return prepared.map((subject) => ({
    ...subject,
    saturdayOnly: key(subject.name) === key("Entrepreneurship: Idea to Startup")
  }));
}

module.exports = { prepareSubjectsForTimetable };
