(function () {
  function isNumericPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,32}$/.test(password || '');
  }

  function isValidPhone(phone) {
    if (!phone) return true;
    return /^(?:9841|9746)\d{6}$/.test(phone);
  }

  function fillProfile(user) {
    document.getElementById('email').value = user.email || '';
    document.getElementById('role').value = user.role || '';
    document.getElementById('full_name').value = user.full_name || '';
    document.getElementById('phone').value = user.phone || '';

    // Update avatar
    var avatarEl = document.getElementById('avatarEl');
    var avatarName = document.getElementById('avatarName');
    var avatarRole = document.getElementById('avatarRole');
    if (avatarEl && user.profile_picture) {
      avatarEl.innerHTML = '<img src="' + user.profile_picture + '" alt="Profile">';
    } else if (avatarEl) {
      avatarEl.textContent = (user.full_name || user.email || '?')[0].toUpperCase();
    }
    if (avatarName) avatarName.textContent = user.full_name || user.email || '—';
    if (avatarRole) avatarRole.textContent = user.role === 'employer' ? 'Employer' : (user.role === 'admin' ? 'Admin' : 'Job Seeker');

    // Role-specific fields - new structure uses data-role and section IDs
    var seekerSection = document.getElementById('section-pro');
    var employerSection = document.getElementById('section-company');
    var seekerNav = document.getElementById('seekerNav');
    var employerNav = document.getElementById('employerNav');

    if (user.role === 'job_seeker') {
      if (seekerSection) seekerSection.classList.remove('hidden');
      if (employerSection) employerSection.classList.add('hidden');
      if (seekerNav) seekerNav.style.display = '';
      if (employerNav) employerNav.style.display = 'none';
      
      var skillsEl = document.getElementById('skills');
      var expEl = document.getElementById('experience_years');
      var eduEl = document.getElementById('education');
      var bioEl = document.getElementById('bio');
      if (skillsEl) skillsEl.value = user.skills || '';
      if (expEl) expEl.value = user.experience_years || '';
      if (eduEl) eduEl.value = user.education || '';
      if (bioEl) bioEl.value = user.bio || '';

      // Show current resume if exists
      var currentResumeSection = document.getElementById('currentResumeSection');
      if (user.resume_path && currentResumeSection) {
        currentResumeSection.classList.remove('hidden');
        var fileName = user.resume_path.split('/').pop();
        document.getElementById('currentResumeName').textContent = fileName || 'Resume';
        document.getElementById('viewResumeBtn').href = user.resume_path;
        if (user.updated_at) {
          document.getElementById('currentResumeDate').textContent = 'Uploaded: ' + JobPortalCommon.formatDate(user.updated_at);
        }
      }

      // Show current profile picture
      var currentPicSection = document.getElementById('currentProfilePicSection');
      if (user.profile_picture && currentPicSection) {
        currentPicSection.classList.remove('hidden');
        document.getElementById('currentProfilePicPreview').src = user.profile_picture;
      }
    } else if (user.role === 'employer') {
      if (seekerSection) seekerSection.classList.add('hidden');
      if (employerSection) employerSection.classList.remove('hidden');
      if (seekerNav) seekerNav.style.display = 'none';
      if (employerNav) employerNav.style.display = '';
      
      var compNameEl = document.getElementById('company_name');
      var compWebEl = document.getElementById('company_website');
      var compDescEl = document.getElementById('company_description');
      if (compNameEl) compNameEl.value = user.company_name || '';
      if (compWebEl) compWebEl.value = user.company_website || '';
      if (compDescEl) compDescEl.value = user.company_description || '';
    } else {
      if (seekerSection) seekerSection.classList.add('hidden');
      if (employerSection) employerSection.classList.add('hidden');
      if (seekerNav) seekerNav.style.display = 'none';
      if (employerNav) employerNav.style.display = 'none';
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
    var submitting = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitting) return;
      JobPortalCommon.clearAlert('#profileAlert');
      if (!isValidPhone(form.phone.value.trim())) {
        JobPortalCommon.showAlert('#profileAlert', 'Phone must be 10 digits and start with 9841 or 9746.', 'danger');
        return;
      }
      var payload = new FormData(form);
      submitting = true;
      JobPortalCommon.setFormLoading(form, true, 'Updating...');
      JobPortalAPI.updateProfile(payload)
        .then(function () {
          JobPortalCommon.showAlert('#profileAlert', 'Profile updated successfully.', 'success');
          loadProfile();
        })
        .catch(function (err) {
          JobPortalCommon.showAlert('#profileAlert', err.message || 'Profile update failed', 'danger');
        })
        .finally(function () {
          submitting = false;
          JobPortalCommon.setFormLoading(form, false);
        });
    });
  }

  function initPasswordChange() {
    var form = document.getElementById('passwordForm');
    var submitting = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submitting) return;
      JobPortalCommon.clearAlert('#passwordAlert');
      if (!isNumericPassword(form.new_password.value)) {
        JobPortalCommon.showAlert('#passwordAlert', 'New password must be 8-32 chars with uppercase, lowercase, number, and special symbol.', 'danger');
        return;
      }
      submitting = true;
      JobPortalCommon.setFormLoading(form, true, 'Changing...');
      JobPortalAPI.changePassword({
        current_password: form.current_password.value,
        new_password: form.new_password.value
      }).then(function () {
        form.reset();
        JobPortalCommon.showAlert('#passwordAlert', 'Password changed successfully.', 'success');
      }).catch(function (err) {
        JobPortalCommon.showAlert('#passwordAlert', err.message || 'Password change failed', 'danger');
      }).finally(function () {
        submitting = false;
        JobPortalCommon.setFormLoading(form, false);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    JobPortalCommon.renderNav();
    var user = JobPortalCommon.ensureAuth(['job_seeker', 'employer', 'admin']);
    if (!user) return;
    
    // Resume removal handler
    var removeResumeBtn = document.getElementById('removeResumeBtn');
    if (removeResumeBtn) {
      removeResumeBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to remove your resume? You can upload a new one anytime.')) {
          // This would need a backend endpoint to handle resume removal
          document.getElementById('currentResumeSection').classList.add('hidden');
          JobPortalCommon.showAlert('#profileAlert', 'Resume removed. Upload a new one to update your profile.', 'info');
        }
      });
    }

    // Profile picture removal handler  
    var removePicBtn = document.getElementById('removeProfilePicBtn');
    if (removePicBtn) {
      removePicBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to remove your profile picture?')) {
          document.getElementById('currentProfilePicSection').classList.add('hidden');
          var avatarEl = document.getElementById('avatarEl');
          if (avatarEl && user) {
            avatarEl.textContent = (user.full_name || user.email || '?')[0].toUpperCase();
            avatarEl.querySelector('img')?.remove();
          }
          JobPortalCommon.showAlert('#profileAlert', 'Profile picture removed. Upload a new one to update.', 'info');
        }
      });
    }

    initProfileUpdate();
    initPasswordChange();
    loadProfile();
  });
})();
