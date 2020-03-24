document.addEventListener('DOMContentLoaded', function() {
  fetch('../header.html')
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.getElementById('header-div').innerHTML = data;
      document.getElementById('employees-link').classList.remove('selected');
      document.getElementById('positions-link').classList.add('selected');
    });

  fetch('http://localhost:8000/api/v1/jobs/all-job-positions')
    .then((data) => data.json())
    .then((res) => {
      res.forEach((position) => {
        document
          .getElementById('position-table-body')
          .appendChild(createTableRow(position));
      });
    })
    .catch((err) => console.error(err));

  const createTableRow = (position) => {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.setAttribute('class', `column1`);
    const td1Txt = document.createTextNode(position.title);
    td1.appendChild(td1Txt);

    const td2 = document.createElement('td');
    td2.setAttribute('class', `column2`);
    const td2Txt = document.createTextNode(position.short);
    td2.appendChild(td2Txt);

    const td3 = document.createElement('td');
    td3.setAttribute('class', `column3`);
    const td3Txt = document.createTextNode(position.type);
    td3.appendChild(td3Txt);

    const td4 = document.createElement('td');
    td4.setAttribute('class', `column4`);
    const td4Txt = document.createTextNode(position.workingHours);
    td4.appendChild(td4Txt);

    const td5 = document.createElement('td');
    td5.setAttribute('class', `column5`);
    const td5Txt = document.createTextNode(position.description);
    td5.appendChild(td5Txt);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    tr.addEventListener(
      'click',
      () => {
        window.location = `edit-position/${position._id}`;
      },
      false
    );

    return tr;
  };
});
