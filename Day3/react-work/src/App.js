import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import students from "./students.json";
import Edit from "./Edit.png";

function App() {
  const [search, setSearch] = useState("");
  const [studentList, setStudentList] = useState(students);
  const [editingStudentId, setEditingStudentId] = useState(null);

  const [studentImage, setStudentImage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentGroup, setStudentGroup] = useState("");
  const [studentPassedPR, setStudentPassedPR] = useState(false);
  const [studentGrade, setStudentGrade] = useState(1);

  const getFilteredStudents = (list, query) =>
    list.filter((student) => student.fullName.includes(query));

  const [filteredStudents, setFilteredStudents] = useState(
    getFilteredStudents(studentList, search)
  );

  useEffect(() => {
    setFilteredStudents(getFilteredStudents(studentList, search));
  }, [search, studentList]);

  const toggleExamStatus = (id) => {
    const updatedStudents = studentList.map((student) =>
      student.id === id
        ? { ...student, isPassedPR: !student.isPassedPR }
        : student
    );
    setStudentList(updatedStudents);
  };

  const removeStudent = (id) => {
    const updatedStudents = studentList.filter((student) => student.id !== id);
    setStudentList(updatedStudents);
  };

  const addOrEditStudent = (e) => {
    e.preventDefault();

    const newOrUpdatedStudent = {
      id: editingStudentId || Date.now(),
      image: studentImage,
      fullName: studentName,
      group: studentGroup,
      isPassedPR: studentPassedPR,
      grade: studentGrade,
    };

    if (editingStudentId) {
      const updatedStudents = studentList.map((student) =>
        student.id === editingStudentId ? newOrUpdatedStudent : student
      );
      setStudentList(updatedStudents);
      setEditingStudentId(null);
    } else {
      setStudentList((prevStudents) => [...prevStudents, newOrUpdatedStudent]);
    }

    setStudentImage("");
    setStudentName("");
    setStudentGroup("");
    setStudentPassedPR(false);
    setStudentGrade(1);
  };

  const startEditing = (studentId) => {
    const studentToEdit = studentList.find((s) => s.id === studentId);

    setStudentImage(studentToEdit.image);
    setStudentName(studentToEdit.fullName);
    setStudentGroup(studentToEdit.group);
    setStudentPassedPR(studentToEdit.isPassedPR);
    setStudentGrade(studentToEdit.grade);

    setEditingStudentId(studentId);
  };

  return (
    <div className={styles.appContainer}>
      <h1>Search Students</h1>
      <input
        type="text"
        name="search"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        placeholder="Search by name..."
      />
      <form onSubmit={addOrEditStudent}>
        <input
          type="text"
          placeholder="Photo"
          value={studentImage}
          onChange={(e) => setStudentImage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Group"
          value={studentGroup}
          onChange={(e) => setStudentGroup(e.target.value)}
        />
        <section className={styles.PassedContain}>
          <input
            type="checkbox"
            checked={studentPassedPR}
            onChange={(e) => setStudentPassedPR(e.target.checked)}
          />
          <p>Passed PR</p>
        </section>
        <input
          type="number"
          placeholder="Grade"
          max={5}
          min={1}
          value={studentGrade}
          onChange={(e) => setStudentGrade(Number(e.target.value))}
        />
        <button className={styles.AddButton} type="submit">
          Confirm
        </button>
      </form>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Group</th>
            <th>Passed PR</th>
            <th>Grade</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td>
                <img className={styles.ImageStudent} src={student.image} />
              </td>
              <td>
                {search
                  ? student.fullName
                      .split(new RegExp(`(${search})`, "i"))
                      .map((part, index) =>
                        part.toLowerCase() === search.toLowerCase() ? (
                          <span key={index} className={styles.highlighted}>
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )
                  : student.fullName}
              </td>
              <td>{student.group}</td>
              <td>
                <input
                  type="checkbox"
                  name={`isPassedPR-${student.id}`}
                  checked={student.isPassedPR}
                  onChange={() => toggleExamStatus(student.id)}
                />
              </td>
              <td>{student.grade}</td>
              <td>
                <button onClick={() => removeStudent(student.id)}>
                  Delete
                </button>
              </td>
              <td className="">
                <button onClick={() => startEditing(student.id)}>
                  <img src={Edit} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
