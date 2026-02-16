(function () {
  function initLogin() {
    var form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      JobPortalCommon.clearAlert('#authAlert');
      var payload = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      };
      JobPortalAPI.login(payload)
        .then(function (res) {
          JobPortalCommon.setUser(res.user);
          location.href = 'dashboard.html';
        })
        .catch(function (err) {
          JobPortalCommon.showAlert('#authAlert', err.message || 'Login failed', 'danger');
        });
    });
  }

  function roleFields(role) {
    var seeker = document.getElementById('jobSeekerFields');
    var employer = document.getElementById('employerFields');
    if (seeker) seeker.style.display = role === 'job_seeker' ? 'block' : 'none';
    if (employer) employer.style.display = role === 'employer' ? 'block' : 'none';
  }

  function initRegister() {
    var form = document.getElementById('registerForm');
    if (!form) return;

    var roleSelect = document.getElementById('role');
    roleFields(roleSelect.value);
    roleSelect.addEventListener('change', function () {
      roleFields(roleSelect.value);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      JobPortalCommon.clearAlert('#authAlert');
      var role = roleSelect.value;
      var payload = {
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        full_name: document.getElementById('full_name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        role: role
      };

      if (role === 'job_seeker') {
        payload.skills = document.getElementById('skills').value.trim();
        payload.experience_years = document.getElementById('experience_years').value || null;
        payload.education = document.getElementById('education').value.trim();
      } else {
        payload.company_name = document.getElementById('company_name').value.trim();
        payload.company_website = document.getElementById('company_website').value.trim();
      }

      JobPortalAPI.register(payload)
        .then(function () {
          JobPortalCommon.showAlert('#authAlert', 'Registration successful. You can login now.', 'success');
          form.reset();
          roleSelect.value = role;
          roleFields(role);
        })
        .catch(function (err) {
          JobPortalCommon.showAlert('#authAlert', err.message || 'Registration failed', 'danger');
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    JobPortalCommon.renderNav();
    initLogin();
    initRegister();
  });
})();
