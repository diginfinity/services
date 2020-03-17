const addEmployeeURL = 'http://localhost:8000/api/v1/employees/addEmployee';

document.addEventListener('DOMContentLoaded', function() {
  let employeeForm = document.getElementById('employeeForm');
  employeeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      name: employeeForm.elements['name'].value,
      position: employeeForm.elements['position'].value,
      linkedIn: employeeForm.elements['linkedIn'].value
    };

    const params = {
      headers: {
        'content-type': 'application/json; charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify(data)
    };

    fetch(addEmployeeURL, params)
      .then((data) => data.json())
      .then((res) => console.log(res));
  });
});
