import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('audit-form');
  const submitBtn = document.getElementById('submit-btn');

  // Lógica do Modal de Boas-Vindas
  const welcomeModal = document.getElementById('welcome-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (closeModalBtn && welcomeModal) {
    closeModalBtn.addEventListener('click', () => {
      welcomeModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        welcomeModal.style.display = 'none';
      }, 300);
    });
  }

  // Adiciona listener para todos os inputs do formulário
  form.addEventListener('input', () => {
    checkFormValidity();
  });

  form.addEventListener('change', () => {
    checkFormValidity();
  });

  function checkFormValidity() {
    const nomeBase = document.getElementById('nome-base').value;
    const auditor = document.getElementById('auditor').value;
    
    // Regra simples: Pelo menos Nome da Base e Auditor devem ser preenchidos para habilitar o envio
    // Opcionalmente podemos validar os arquivos também
    if (nomeBase.trim() !== '' && auditor !== '') {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.add('hover:bg-gray-800');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitBtn.classList.remove('hover:bg-gray-800');
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Feedback visual
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Simulação de tempo de envio
    setTimeout(() => {
      alert('Auditoria enviada com sucesso para análise!');
      form.reset();
      checkFormValidity();
      submitBtn.textContent = originalText;
    }, 1000);
  });
});
