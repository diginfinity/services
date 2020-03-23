document.addEventListener('DOMContentLoaded', function() {
  const addPositionURL = 'http://localhost:8000/api/v1/jobs/open-job-position';
  const jobPositionForm = document.getElementById('jobPositionForm');

  jobPositionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      title: jobPositionForm.elements['title'].value,
      short: jobPositionForm.elements['short'].value,
      type: jobPositionForm.elements['type'].value,
      workingHours: jobPositionForm.elements['hours'].value,
      description: jobPositionForm.elements['description'].value
    };

    const params = {
      headers: {
        'content-type': 'application/json; charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify(data)
    };

    fetch(addPositionURL, params)
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.error(err));
  });
});
