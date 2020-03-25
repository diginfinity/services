document.addEventListener('DOMContentLoaded', function() {
  const employeeURL = 'http://localhost:8000/api/v1/employees';
  const employeeForm = document.getElementById('employeeForm');
  const employeeId = location.pathname.split('/')[
    location.pathname.split('/').length - 1
  ];

  // helper functions
  const sendRequest = (URL, params, callback) => {
    fetch(URL, params)
      .then((data) => data.json())
      .then((res) => {
        callback(res);
      })
      .catch((err) => console.error(err));
  };

  const onDeleteClick = (employeeId) => {
    const params = {
      headers: {
        'content-type': 'application/json; charset=UTF-8'
      },
      method: 'DELETE'
    };
    sendRequest(
      `${employeeURL}/${employeeId}`,
      params,
      () => (window.location = '/employees')
    );
  };

  const populateForm = (employee) => {
    document.getElementById('name').value = employee.name;
    document.getElementById('position').value = employee.position;
    document.getElementById('linkedIn').value = employee.linkedIn;

    if (employee.imageId) {
      const img = document.createElement('img');
      img.setAttribute('src', `/api/v1/image/${employee.imageId}`);
      img.setAttribute('alt', 'Image');
      img.setAttribute('class', 'employee-image');
      document.getElementById('image-div').appendChild(img);
    }
  };

  // initialization

  fetch(`${employeeURL}/${employeeId}`)
    .then((data) => data.json())
    .then((employee) => {
      populateForm(employee);
    })
    .catch((err) => console.error(err));

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
      method: 'PUT',
      body: JSON.stringify(data)
    };

    const files = document.getElementById('file-input').files;
    if (files.length === 1) {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      sendRequest(`/api/v1/employees/uploadImage?id=${employeeId}`, {
        method: 'POST',
        body: formData
      });
    }

    sendRequest(
      `${employeeURL}/${employeeId}`,
      params,
      () => (window.location = '/employees')
    );
  });

  document
    .getElementById('delete-employee-button')
    .addEventListener('click', () => onDeleteClick(employeeId), false);
});
