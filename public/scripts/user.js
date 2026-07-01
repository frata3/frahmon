document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('account-form');

  function getCurrentUser() {
    const meta = document.querySelector('meta[name="current-user"]');
    if (!meta) return null;
    try {
      const parsed = JSON.parse(meta.getAttribute('content'));
      return parsed === 'guest' ? null : parsed;
    } catch (err) {
      console.error('Failed to parse current-user meta tag:', err);
      return null;
    }
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    console.warn('No authenticated user found; account form disabled.');
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;

    const payload = {
      username: document.getElementById('username').value.trim(),
      fullname: document.getElementById('fullname').value.trim(),
      bio: document.getElementById('bio').value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';

    try {
      const res = await axios.put(`/@${currentUser.username}/account`, payload);
      console.log('Account updated:', res.data);
      currentUser.username = res.data.data.username; // keep local copy in sync
    } catch (err) {
      console.error('Failed to update account:', err.response?.data || err.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
});