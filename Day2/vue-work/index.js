var studentsArray = [
  {
    fullName: "Іванов Іван Іванович",
    group: "РПЗ 20 1/9",
    birthYear: 2005,
    isPassedExam: true,
  },
  {
    fullName: "Ушаков Ростислав Евгеневич",
    group: "РПЗ 20 2/9",
    birthYear: 2005,
    isPassedExam: false,
  },
  {
    fullName: "Чупрун Дмитро Олександрович",
    group: "РПЗ 20 1/9",
    birthYear: 2005,
    isPassedExam: true,
  },
];

const { createApp, ref, computed } = Vue;
createApp({
  setup() {
    let students = ref(studentsArray);
    let search = ref("");

    const deleteStudent = (student) => {
      students.value = [...students.value].filter((st) => {
        return st !== student;
      });
    };
    return { students, search, deleteStudent };
  },
}).mount("#app");
