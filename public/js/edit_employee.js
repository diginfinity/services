document.addEventListener('DOMContentLoaded', function() {
  const employeeId = location.pathname.split('/')[
    location.pathname.split('/').length - 1
  ];

  console.log(employeeId);
});
