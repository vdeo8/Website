// Minimal interactivity for demo banking site
document.addEventListener('DOMContentLoaded', () => {
  const openAccountBtn = document.getElementById('openAccountBtn');
  const accountModal = document.getElementById('accountModal');
  const modalClose = document.getElementById('modalClose');
  const modalCancel = document.getElementById('modalCancel');
  const openAccountForm = document.getElementById('openAccountForm');
  const openAccountMsg = document.getElementById('openAccountMsg');
  const openAccountButtons = document.querySelectorAll('.open-account');
  const acctypeInput = document.getElementById('acctype');

  function showModal(type = '') {
    accountModal.hidden = false;
    if (acctypeInput) acctypeInput.value = type;
    openAccountMsg.textContent = '';
    setTimeout(() => accountModal.querySelector('input[name="fullname"]').focus(), 50);
  }

  function closeModal() {
    accountModal.hidden = true;
    openAccountForm.reset();
  }

  openAccountBtn && openAccountBtn.addEventListener('click', () => showModal('Checking'));
  modalClose && modalClose.addEventListener('click', closeModal);
  modalCancel && modalCancel.addEventListener('click', closeModal);

  openAccountButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = e.currentTarget.dataset.type || '';
      showModal(type);
    });
  });

  openAccountForm && openAccountForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData(openAccountForm);
    const name = form.get('fullname')?.trim();
    const type = form.get('acctype') || 'Checking';
    const deposit = parseFloat(form.get('deposit') || 0);

    if (!name) {
      openAccountMsg.textContent = 'Please enter your full name.';
      openAccountMsg.style.color = 'crimson';
      return;
    }

    // Simulate account creation (demo only)
    openAccountMsg.style.color = 'green';
    openAccountMsg.textContent = `Success! A ${type} account for ${name} was created with $${deposit.toFixed(2)} initial deposit (demo).`;
    setTimeout(() => closeModal(), 1800);
  });

  // Contact form
  const contactForm = document.getElementById('contactForm');
  const contactMsg = document.getElementById('contactMsg');
  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(contactForm);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const message = (fd.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      contactMsg.style.color = 'crimson';
      contactMsg.textContent = 'Please fill out all fields.';
      return;
    }
    // Demo behaviour: show a friendly message and clear the form
    contactMsg.style.color = 'green';
    contactMsg.textContent = 'Thanks — your message was received (demo).';
    contactForm.reset();
  });

  // Simple login button placeholder
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) loginBtn.addEventListener('click', () => alert('Demo login flow — not implemented.'));
});