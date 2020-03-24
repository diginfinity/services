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

  const createRequestParams = (httpMethod) => {
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
      body: JSON.stringify(data)
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

  // --------------------- initalization

  fetchHeader();

  if (!isEdit) {
    jobPositionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const params = createRequestParams('POST');

      fetch(`${jobPositionURL}/open-job-position`, params)
        .then((data) => data.json())
        .then((res) => {
          window.location = '/job-positions';
        })
        .catch((err) => console.error(err));
    });
  } else if (isEdit) {
    const jobPositionId = location.pathname.split('/')[2];

    fetch(`${jobPositionURL}/${jobPositionId}`)
      .then((data) => data.json())
      .then((position) => {
        populateFormAndText(position);
      })
      .catch((err) => console.error(err));

    jobPositionForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const params = createRequestParams('PUT');

      fetch(`${jobPositionURL}/${jobPositionId}`, params)
        .then((data) => data.json())
        .then(() => {
          window.location = '/job-positions';
        })
        .catch((err) => console.error(err));
    });
  }
});
