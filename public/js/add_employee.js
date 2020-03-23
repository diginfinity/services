document.addEventListener('DOMContentLoaded', function() {
  const addEmployeeURL = 'http://localhost:8000/api/v1/employees/addEmployee';
  const employeeForm = document.getElementById('employeeForm');
  const imageUploadForm = document.getElementById('image-upload-form');
  let employeeId = '';

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
      .then((res) => {
        document.getElementById('employee-form-container').style.display =
          'none';
        document.getElementById('image-form-container').style.display = 'flex';
        employeeId = res._id;
      })
      .catch((err) => console.error(err));
  });

  imageUploadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (event.target.file.files.length === 1) {
      const file = event.target.file.files[0];
      const formData = new FormData();
      formData.append('file', file);
      fetch(`/api/v1/employees/uploadImage?id=${employeeId}`, {
        method: 'POST',
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          window.location = '/dashboard';
        })
        .catch((error) => {
          console.error(error);
        });
    }
  });
});
