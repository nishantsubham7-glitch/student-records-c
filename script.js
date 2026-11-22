const STORAGE_KEY = "student_record_system_v1";

const form = document.getElementById("student-form");
const rollInput = document.getElementById("roll");
const nameInput = document.getElementById("name");
const courseInput = document.getElementById("course");
const marksInput = document.getElementById("marks");
const searchInput = document.getElementById("search-input");
const clearAllBtn = document.getElementById("clear-all-btn");
const recordsBody = document.getElementById("records-body");

const totalStudentsEl = document.getElementById("total-students");
const averageMarksEl = document.getElementById("average-marks");
const highestMarksEl = document.getElementById("highest-marks");

let students = loadStudents();

function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function updateSummary() {
  const count = students.length;
  totalStudentsEl.textContent = String(count);

  if (count === 0) {
    averageMarksEl.textContent = "0.00";
    highestMarksEl.textContent = "0.00";
    return;
  }

  const totalMarks = students.reduce((sum, s) => sum + Number(s.marks), 0);
  const highest = students.reduce((max, s) => Math.max(max, Number(s.marks)), 0);

  averageMarksEl.textContent = (totalMarks / count).toFixed(2);
  highestMarksEl.textContent = highest.toFixed(2);
}

function renderStudents() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = students.filter(
    (s) =>
      String(s.roll).toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.course.toLowerCase().includes(query)
  );

  recordsBody.innerHTML = "";

  if (filtered.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.className = "empty";
    td.textContent = query
      ? "No matching student records found."
      : "No student records yet. Add one above.";
    tr.appendChild(td);
    recordsBody.appendChild(tr);
    return;
  }

  filtered.forEach((student) => {
    const tr = document.createElement("tr");

    const rollTd = document.createElement("td");
    rollTd.textContent = student.roll;

    const nameTd = document.createElement("td");
    nameTd.textContent = student.name;

    const courseTd = document.createElement("td");
    courseTd.textContent = student.course;

    const marksTd = document.createElement("td");
    marksTd.textContent = Number(student.marks).toFixed(2);

    const actionTd = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-delete";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteStudent(student.roll));
    actionTd.appendChild(delBtn);

    tr.append(rollTd, nameTd, courseTd, marksTd, actionTd);
    recordsBody.appendChild(tr);
  });
}

function addStudent(event) {
  event.preventDefault();

  const roll = parseInt(rollInput.value, 10);
  const name = nameInput.value.trim();
  const course = courseInput.value.trim();
  const marks = parseFloat(marksInput.value);

  if (!roll || !name || !course || Number.isNaN(marks) || marks < 0 || marks > 100) {
    return;
  }

  if (students.some((s) => s.roll === roll)) {
    alert(`Roll number ${roll} already exists.`);
    return;
  }

  students.push({ roll, name, course, marks });
  saveStudents();
  updateSummary();
  renderStudents();

  form.reset();
  rollInput.focus();
}

function deleteStudent(roll) {
  students = students.filter((s) => s.roll !== roll);
  saveStudents();
  updateSummary();
  renderStudents();
}

function clearAllStudents() {
  if (students.length === 0) return;
  students = [];
  saveStudents();
  updateSummary();
  renderStudents();
}

form.addEventListener("submit", addStudent);
searchInput.addEventListener("input", renderStudents);
clearAllBtn.addEventListener("click", clearAllStudents);

updateSummary();
renderStudents();
