const baseEndpoint = `https://appleseed-wa.herokuapp.com/api/users/`;
const container = document.querySelector('#container');
const formSearch = document.querySelector('.search input');
const dropdown = document.getElementById('dropdown');


const getStudents = async () => {
  let callApi = await fetch(baseEndpoint);
  let data = await callApi.json();

  let students = await Promise.all(
    data.map(async (s) => {
      let information = await getPersonalInfo(s.id)
      return { id: s.id, First_Name: s.firstName, Last_Name: s.lastName, Capsule: s.capsule, Age: information.age, City: information.city, Gender: information.gender, Hobby: information.hobby }
    })
  )
 
  return students;

}


async function getPersonalInfo(id) {
  let information = await fetch(`${baseEndpoint}${id}`);
  return await information.json();
}

async function createTable() {
  students = await getStudents();
  let table = document.createElement('table');
  tbl_string = `<thead>  
  
  <th>id</th>
  <th>First Name</th>
  <th>Last Name</th>
  <th>capsule</th>
  <th>Age</th>
  <th>City</th>
  <th>Gender</th>
  <th>Hobby</th>
 
</thead>`

  table.innerHTML += `<tbody>`;
  students.forEach((s) => {
    tbl_string += `<tr>
            <td>${s.id}</td>
             <td class="log First_Name">${s.First_Name}</td>
              <td class="log Last_Name">${s.Last_Name}</td>
               <td class="log Capsule">${s.Capsule}</td>
               <td class="log Age">${s.Age}</td>
               <td class="log City">${s.City}</td>
               <td class="log Gender">${s.Gender}</td>
               <td class="log Hobby">${s.Hobby}</td>
               <td><i class="fas fa-edit edit"></i></td>
               <td><i class="fas fa-trash-alt delete"></i></td>
                </tr>`
  })
  tbl_string += `</tbody>`;

  table.innerHTML = tbl_string;
  container.appendChild(table);
  localStorage.setItem('table',tbl_string);
  // Get Data
  // Update Data
}



container.addEventListener('click', e => {
  let target = e.target.classList;
  let cellsinRow = e.target.parentElement.parentElement.children;
  let cellsLog = Array.from(cellsinRow).filter((cell) => cell.classList.contains('log'));


  if (target.contains('delete')) {
    e.target.parentElement.parentElement.remove();
  }
  else if (target.contains('edit')) {
    cellsLog.forEach((el) => toEditMode(el));
    updateButtons(e.target.parentElement);
  }
  else if (target.contains('cancel')) {
    cellsLog.forEach((x) => {
      x.innerHTML = x.firstElementChild.placeholder;
    })
    updateButtons(e.target.parentElement);
  }
  else if (target.contains('save')) {
    for (let i = 0; i < cellsLog.length; i++) {
      let innercontent = cellsLog[i].firstElementChild.value
      if (innercontent === "") {
        cellsLog[i].innerHTML = cellsLog[i].firstElementChild.placeholder;
      }
      else {
        cellsLog[i].innerHTML = innercontent;
      }
    }
    updateButtons(e.target.parentElement);
  }
})


// Function that replaces buttons between Edit/Delete and Save/Cancel
function updateButtons(e) {
  let temp = e.children[0].classList;
  if (temp.contains('edit')) {
    e.children[0].className = "far fa-save save";
    e.nextSibling.nextSibling.children[0].className = "far fa-window-close cancel";
  }

  else if (temp.contains('save')) {
    e.children[0].className = "fas fa-edit edit";
    e.nextSibling.nextSibling.children[0].className = "fas fa-trash-alt delete";
  }

  else if (temp.contains('cancel')) {
    e.children[0].className = "fas fa-trash-alt delete";
    e.previousSibling.previousSibling.children[0].className = "fas fa-edit edit";
  };
}

// Update field to editable field
function toEditMode(e) {
  e.innerHTML = `<input type="text" placeholder=${e.textContent}>`;
}


//////////////////////   Search Function //////////////////////////////

//search => keyup event
formSearch.addEventListener('keyup', () => {

  const term = formSearch.value.trim().toLowerCase();
  this.filterTodos(term,valuefromDropDown);
});

let valuefromDropDown
dropdown.addEventListener('change',(e)=>{
  valuefromDropDown=e.target.value;
})

function filterTodos(term,searchHeader= '.First_Name') {
  const headerData = document.querySelectorAll(searchHeader);
  Array.from(headerData)
    .filter((printContent)=>!printContent.textContent.toLowerCase().includes(term))
    .forEach((printContent)=>printContent.parentElement.classList.add('filtered'));  

  Array.from(headerData)
    .filter((printContent)=>printContent.textContent.toLowerCase().includes(term))
    .forEach((printContent)=>printContent.parentElement.classList.remove('filtered'));
}



