/* set registration data into local storage */
export function setData(data) {
  const arrStudentData = getData();
  arrStudentData.push(data);
  localStorage.setItem("users", JSON.stringify(arrStudentData));
}

/* update data into local storage using index */
export function updateData(index, newData) {
  const arrStudentData = getData();

  arrStudentData[index] = newData;

  localStorage.setItem("users", JSON.stringify(arrStudentData));
}

/* set page type n */
export function setPageType(pageType) {
  localStorage.setItem("page", pageType);
}

/* retrieve page type form local storage */
export function getPageType() {
  return localStorage.getItem("page");
}

/* get rows of data from local storage */
export function getData() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
/* delete register user form local storage */
export function deleteData(deletingData) {
  const arrStudentData = getData() || [];
  const data = arrStudentData.filter(studentData => {
    return (
      studentData.name === deletingData.name &&
      deletingData.age === studentData.age &&
      studentData.number === deletingData.number
    );
  });

  if (data.length > 0) {
    const index = arrStudentData.indexOf(data[0]);
    if (index > -1) {
      arrStudentData.splice(index, 1);
    }
  }

  localStorage.setItem("users", JSON.stringify(arrStudentData));
}
