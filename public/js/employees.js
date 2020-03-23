document.addEventListener('DOMContentLoaded', function() {
  fetch('http://localhost:8000/api/v1/employees/all-employees')
    .then((data) => data.json())
    .then((res) => {
      res.forEach((employee) => {
        document
          .getElementById('employee-table-body')
          .appendChild(createTableRow(employee));
      });
    })
    .catch((err) => console.error(err));

  const createTableRow = (employee) => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.setAttribute('class', `column1`);
    const td1Txt = document.createTextNode(employee.name);
    td1.appendChild(td1Txt);

    const td2 = document.createElement('td');
    td2.setAttribute('class', `column2`);
    const td2Txt = document.createTextNode(employee.position);
    td2.appendChild(td2Txt);

    const td3 = document.createElement('td');
    td3.setAttribute('class', `column3`);
    const td3Txt = document.createTextNode(employee.linkedIn);
    td3.appendChild(td3Txt);

    const td4 = document.createElement('td');
    td4.setAttribute('class', `column4`);
    if (employee.imageId) {
      const img = document.createElement('img');
      img.setAttribute('src', `/api/v1/image/${employee.imageId}`);
      img.setAttribute('alt', 'Image');
      img.setAttribute('class', 'employee-image');
      td4.appendChild(img);
    }

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    tr.addEventListener(
      'click',
      () => {
        window.location = `edit-employee/${employee._id}`;
      },
      false
    );

    return tr;
  };
});
