/**
 * Contact form -> Flamestack backend (JSON POST)
 */
(function () {
  "use strict";

  const form = document.getElementById('contact-form');
  if (!form) return;

  const endpoint = form.getAttribute('action');
  const loading = form.querySelector('.loading');
  const errorBox = form.querySelector('.error-message');
  const sentBox = form.querySelector('.sent-message');
  const submitBtn = form.querySelector('button[type="submit"]');

  function setState({ isLoading = false, error = '', sent = false }) {
    loading.classList.toggle('d-block', isLoading);
    errorBox.textContent = error;
    errorBox.classList.toggle('d-block', !!error);
    sentBox.classList.toggle('d-block', sent);
    submitBtn.disabled = isLoading;
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const payload = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim()
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setState({ error: 'Please fill in all fields.' });
      return;
    }

    setState({ isLoading: true });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let msg = `Something went wrong (${response.status}). Please try again.`;
        try {
          const data = await response.json();
          if (data && data.message) msg = data.message;
        } catch (_) { /* non-JSON error body */ }
        throw new Error(msg);
      }

      setState({ sent: true });
      form.reset();
    } catch (err) {
      setState({ error: err.message || 'Network error. Please try again.' });
    }
  });
})();
