document.addEventListener('DOMContentLoaded', function() {
  const addEmployeeURL = 'http://localhost:8000/api/v1/employees/addEmployee';
  const employeeForm = document.getElementById('employeeForm');
  const imageUploadForm = document.getElementById('image-upload-form');
  let employeeId = '';

  // helper functions

  const sendRequest = (URL, params, callback) => {
    fetch(URL, params)
      .then((data) => data.json())
      .then((res) => {
        callback(res);
      })
      .catch((err) => console.error(err));
  };

  // initialization

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

    sendRequest(addEmployeeURL, params, (res) => {
      document.getElementById('employee-form-container').style.display = 'none';
      document.getElementById('image-form-container').style.display = 'flex';
      employeeId = res._id;
    });
  });

  imageUploadForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (event.target.file.files.length === 1) {
      const file = event.target.file.files[0];
      const formData = new FormData();
      formData.append('file', file);

      sendRequest(
        `/api/v1/employees/uploadImage?id=${employeeId}`,
        {
          method: 'POST',
          body: formData
        },
        () => (window.location = '/employees')
      );
    }
  });
});
