(function () {
  function fillProfile(user) {
    document.getElementById('email').value = user.email || '';
    document.getElementById('role').value = user.role || '';
    document.getElementById('full_name').value = user.full_name || '';
    document.getElementById('phone').value = user.phone || '';

    var seeker = document.getElementById('jobSeekerFields');
    var employer = document.getElementById('employerFields');

    if (user.role === 'job_seeker') {
      seeker.style.display = 'block';
      employer.style.display = 'none';
      document.getElementById('skills').value = user.skills || '';
      document.getElementById('experience_years').value = user.experience_years || '';
      document.getElementById('education').value = user.education || '';
      document.getElementById('bio').value = user.bio || '';
    } else if (user.role === 'employer') {
      seeker.style.display = 'none';
      employer.style.display = 'block';
      document.getElementById('company_name').value = user.company_name || '';
      document.getElementById('company_website').value = user.company_website || '';
      document.getElementById('company_description').value = user.company_description || '';
    } else {
      seeker.style.display = 'none';
      employer.style.display = 'none';
    }
  }

  function loadProfile() {
    JobPortalAPI.getProfile()
      .then(function (res) {
        fillProfile(res.data);
        var current = JobPortalCommon.getUser();
        if (current) {
          current.full_name = res.data.full_name;
          JobPortalCommon.setUser(current);
        }
      })
      .catch(function (err) {
        JobPortalCommon.showAlert('#profileAlert', err.message || 'Unable to load profile', 'danger');
      });
  }

  function initProfileUpdate() {
    var form = document.getElementById('profileForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      JobPortalCommon.clearAlert('#profileAlert');
      var payload = new FormData(form);
      JobPortalAPI.updateProfile(payload)
        .then(function () {
          JobPortalCommon.showAlert('#profileAlert', 'Profile updated successfully.', 'success');
          loadProfile();
        })
        .catch(function (err) {
          JobPortalCommon.showAlert('#profileAlert', err.message || 'Profile update failed', 'danger');
        });
    });
  }

  function initPasswordChange() {
    var form = document.getElementById('passwordForm');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      JobPortalCommon.clearAlert('#passwordAlert');
      JobPortalAPI.changePassword({
        current_password: form.current_password.value,
        new_password: form.new_password.value
      }).then(function () {
        form.reset();
        JobPortalCommon.showAlert('#passwordAlert', 'Password changed successfully.', 'success');
      }).catch(function (err) {
        JobPortalCommon.showAlert('#passwordAlert', err.message || 'Password change failed', 'danger');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    JobPortalCommon.renderNav();
    var user = JobPortalCommon.ensureAuth(['job_seeker', 'employer', 'admin']);
    if (!user) return;
    initProfileUpdate();
    initPasswordChange();
    loadProfile();
  });
})();
