const tableBody = document.querySelector('.js-tbody');
const addButton = document.querySelector('button');
const quantityInput = document.getElementById('quantity');

let list = [{
  firstName: 'Василий',
  secondName: 'Петров',
  gradeOne: 'да',
  gradeTwo: 'нет'
}];

loadTableFromLocalStorage();
renderList();

function renderList() {
  let tableHTML = '';
  list.forEach((listObject, index) => {
    const {firstName, secondName, gradeOne, gradeTwo} = listObject;
    let rowClass = "";
    if (!firstName || !secondName || !gradeOne || !gradeTwo) {
      rowClass = "";
    } else if (gradeOne === "да" && gradeTwo === "да") {
      rowClass = "green-row";
    } else if (gradeOne === "нет" && gradeTwo === "нет") {
      rowClass = "red-row";
    } else if ((gradeOne === "да" && gradeTwo === "нет") || (gradeOne === "нет" && gradeTwo === "да")) {
      rowClass = "yellow-row";
    }
    const html = `
      <tr id="row-${index}" class="${rowClass}">
          <td><input class="name js-name" value="${firstName}"></td>
          <td><input class="name js-name" value="${secondName}"></td>
          <td>
              <select>
                  <option value="" ${gradeOne === '' ? 'selected' : ''}></option>
                  <option value="да" ${gradeOne === 'да' ? 'selected' : ''}>да</option>
                  <option value="нет" ${gradeOne === 'нет' ? 'selected' : ''}>нет</option>
                  <option class="js-clear" value="clear">Очистить содержимое</option>
              </select>
          </td>
          <td>
              <select>
                  <option value="" ${gradeTwo === '' ? 'selected' : ''}></option>
                  <option value="да" ${gradeTwo === 'да' ? 'selected' : ''}>да</option>
                  <option value="нет" ${gradeTwo === 'нет' ? 'selected' : ''}>нет</option>
                  <option class="js-clear" value="clear">Очистить содержимое</option>
              </select>
          </td>
      </tr>`;
    tableHTML += html;
  });
  tableBody.innerHTML = tableHTML;
  addClearButtonListeners();
  inputListeners();
  saveTableToLocalStorage();
  addSelectListeners();
}

function updateRowColor(row, firstName, secondName, gradeOne, gradeTwo) {
  if (row) {
    if (!firstName || !secondName || !gradeOne || !gradeTwo) {
      row.className = "";
    } else if (gradeOne === "да" && gradeTwo === "да") {
      row.className = "green-row";
    } else if (gradeOne === "нет" && gradeTwo === "нет") {
      row.className = "red-row";
    } else if ((gradeOne === "да" && gradeTwo === "нет") || (gradeOne === "нет" && gradeTwo === "да")) {
      row.className = "yellow-row";
    } else {
      row.className = "";
    }
    console.log(`Row ${row.id} updated with class ${row.className}`);
  }
}

function addRows() {
  const trQuantity = quantityInput.value;
  for (let i = 0; i < trQuantity; i++) {
    list.push({
      firstName: '',
      secondName: '',
      gradeOne: '',
      gradeTwo: ''
    });
  }
  renderList();
}

addButton.addEventListener('click', addRows);

function addClearButtonListeners() {
  const selects = tableBody.querySelectorAll("select");
  selects.forEach((select) => {
    select.addEventListener("change", (event) => {
      if (event.target.value === "clear") {
        deleteRow(event.target);
      }
    });
  });
}

function deleteRow(selectElement) {
  const row = selectElement.closest("tr");
  const rowIndex = Array.from(row.parentNode.children).indexOf(row);
  list.splice(rowIndex, 1);
  saveTableToLocalStorage();
  renderList();
}

function saveTableToLocalStorage() {
  localStorage.setItem("list", JSON.stringify(list));
}

function loadTableFromLocalStorage() {
  let savedList = localStorage.getItem("list");
  if (savedList) {
    list = JSON.parse(savedList);
    renderList();
  }
}

function inputListeners() {
  const inputs = document.querySelectorAll(".js-name");
  inputs.forEach((input, index) => {
    input.addEventListener("blur", (event) => {
      const rowIndex = Math.floor(index / 2);
      const isFirstName = index % 2 === 0;
      if (isFirstName) {
        list[rowIndex].firstName = event.target.value;
      } else {
        list[rowIndex].secondName = event.target.value;
      }
      saveTableToLocalStorage();
      const row = document.getElementById(`row-${rowIndex}`);
      if (row) {
        updateRowColor(row, list[rowIndex].firstName, list[rowIndex].secondName, list[rowIndex].gradeOne, list[rowIndex].gradeTwo);
      }
    });
  });
}

function addSelectListeners() {
  const selects = tableBody.querySelectorAll("select");
  selects.forEach((select, index) => {
    select.addEventListener("change", (event) => {
      const rowIndex = Math.floor(index / 2); 
      const isGradeOne = index % 2 === 0; 
      const value = event.target.value;

      if (value !== "clear") {
        if (isGradeOne) {
          list[rowIndex].gradeOne = value;
        } else {
          list[rowIndex].gradeTwo = value;
        }
        saveTableToLocalStorage();
        const row = document.getElementById(`row-${rowIndex}`);
        if (row) {
          updateRowColor(row, list[rowIndex].firstName, list[rowIndex].secondName, list[rowIndex].gradeOne, list[rowIndex].gradeTwo);
        }
      }
    });
  });
}