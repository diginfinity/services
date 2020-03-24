document.addEventListener('DOMContentLoaded', function() {
  const isEdit =
    location.pathname.split('/')[1] === 'edit-position' ? true : false;
  const jobPositionForm = document.getElementById('jobPositionForm');
  const jobPositionURL = 'http://localhost:8000/api/v1/jobs';

  // ------------------------ helper functions

  const fetchHeader = () => {
    fetch('../header.html')
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        document.getElementById('header-div').innerHTML = data;
        document.getElementById('positions-link').classList.remove('selected');
        document.getElementById('employees-link').classList.remove('selected');
      });
  };

  const createRequestParams = (httpMethod, needBody) => {
    const data = {
      title: jobPositionForm.elements['title'].value,
      short: jobPositionForm.elements['short'].value,
      type: jobPositionForm.elements['type'].value,
      workingHours: jobPositionForm.elements['hours'].value,
      description: jobPositionForm.elements['description'].value
    };

    return {
      headers: {
        'content-type': 'application/json; charset=UTF-8'
      },
      method: httpMethod,
      body: needBody ? JSON.stringify(data) : undefined
    };
  };

  const populateFormAndText = (jobPosition) => {
    document.getElementById('title').value = jobPosition.title;
    document.getElementById('short').value = jobPosition.short;
    document.getElementById('type').value = jobPosition.type;
    document.getElementById('hours').value = jobPosition.workingHours;
    document.getElementById('description').value = jobPosition.description;
    document.getElementById('position-header').textContent =
      'Edit Job Position';
    document.getElementById('position-button').textContent = 'Save';
  };

  const sendRequest = (URL, params, callback) => {
    fetch(URL, params)
      .then((data) => data.json())
      .then((res) => {
        callback(res);
      })
      .catch((err) => console.error(err));
  };

  const onDeleteClick = (jobPositionId) => {
    sendRequest(
      `${jobPositionURL}/${jobPositionId}`,
      createRequestParams('DELETE', false),
      () => (window.location = '/job-positions')
    );
  };

  // --------------------- initalization

  fetchHeader();

  if (!isEdit) {
    document.getElementById('delete-position-button').style.display = 'none';
    jobPositionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      sendRequest(
        `${jobPositionURL}/open-job-position`,
        createRequestParams('POST', true),
        () => (window.location = '/job-positions')
      );
    });
  } else if (isEdit) {
    const jobPositionId = location.pathname.split('/')[2];

    document
      .getElementById('delete-position-button')
      .addEventListener('click', () => onDeleteClick(jobPositionId), false);

    sendRequest(
      `${jobPositionURL}/${jobPositionId}`,
      undefined,
      populateFormAndText
    );

    jobPositionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      sendRequest(
        `${jobPositionURL}/${jobPositionId}`,
        createRequestParams('PUT', true),
        () => (window.location = '/job-positions')
      );
    });
  }
});
