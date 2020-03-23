document.addEventListener('DOMContentLoaded', function() {
  const employeeURL = 'http://localhost:8000/api/v1/employees';
  const employeeForm = document.getElementById('employeeForm');
  const employeeId = location.pathname.split('/')[
    location.pathname.split('/').length - 1
  ];

  fetch(`${employeeURL}/${employeeId}`)
    .then((data) => data.json())
    .then((employee) => {
      document.getElementById('name').value = employee.name;
      document.getElementById('position').value = employee.position;
      document.getElementById('linkedIn').value = employee.linkedIn;

      if (employee.imageId) {
        const img = document.createElement('img');
        img.setAttribute('src', `/api/v1/image/${employee.imageId}`);
        img.setAttribute('alt', 'Image');
        img.setAttribute('class', 'employee-image');
        document.getElementById('image-div').appendChild(img);
        console.log(img);
      }
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
      fetch(`/api/v1/employees/uploadImage?id=${employeeId}`, {
        method: 'POST',
        body: formData
      }).catch((error) => {
        console.error(error);
      });
    }

    fetch(`${employeeURL}/${employeeId}`, params)
      .then((data) => data.json())
      .then(() => {
        window.location = '/dashboard';
      })
      .catch((err) => console.error(err));
  });
});
