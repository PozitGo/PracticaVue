import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import students from "./students.json";

function App() {
  const [search, setSearch] = useState("");
  const [studentList, setStudentList] = useState(students);

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
        ? { ...student, isPassedExam: !student.isPassedExam }
        : student
    );
    setStudentList(updatedStudents);
  };

  const removeStudent = (id) => {
    const updatedStudents = studentList.filter((student) => student.id !== id);
    setStudentList(updatedStudents);
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
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Group</th>
            <th>Birth Year</th>
            <th>Passed Exam</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
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
              <td>{student.birthYear}</td>
              <td>
                <input
                  type="checkbox"
                  name={`isPassedExam-${student.id}`}
                  checked={student.isPassedExam}
                  onChange={() => toggleExamStatus(student.id)}
                />
              </td>
              <td>
                <button onClick={() => removeStudent(student.id)}>
                  Вiдрахувати
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
