document.addEventListener('DOMContentLoaded', function() {
  fetch('../header.html')
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      document.getElementById('header-div').innerHTML = data;
      if (location.pathname.split('/')[1] === 'employees') {
        document.getElementById('positions-link').classList.remove('selected');
        document.getElementById('employees-link').classList.add('selected');
      } else if (location.pathname.split('/')[1] === 'job-positions') {
        document.getElementById('positions-link').classList.add('selected');
        document.getElementById('employees-link').classList.remove('selected');
      } else {
        document.getElementById('positions-link').classList.remove('selected');
        document.getElementById('employees-link').classList.remove('selected');
      }
    });
});
