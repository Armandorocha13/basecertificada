import './style.css'
import { createClient } from '@supabase/supabase-js'

// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://gackvwuokitcfvkrgngt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhY2t2d3Vva2l0Y2Z2a3Jnbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMjg4MTMsImV4cCI6MjA4ODkwNDgxM30.h9ov4bYRfKuwBAmxPfjPDEE1b1xL4s4GuYzcgakRoKc';
const BUCKET_NAME = 'fotos' // VERIFIQUE SE O NOME NO SUPABASE É EXATAMENTE ESTE

// Só inicializa se as chaves existirem
const supabase = (SUPABASE_URL && SUPABASE_KEY) ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

document.addEventListener('DOMContentLoaded', () => {
  console.log(`Sistema iniciado. Bucket configurado: ${BUCKET_NAME}`);
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

  // Lógica do Dropzone
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('evidencias');
  const fileList = document.getElementById('file-list');
  const fileListContainer = document.getElementById('file-list-container');

  if (dropzone && fileInput) {
    // Abrir seletor ao clicar no dropzone
    dropzone.addEventListener('click', () => fileInput.click());

    // Efeito visual ao arrastar
    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.querySelector('div').classList.add('border-white/60', 'bg-white/20');
    });

    ['dragleave', 'dragend'].forEach(type => {
      dropzone.addEventListener(type, () => {
        dropzone.querySelector('div').classList.remove('border-white/60', 'bg-white/20');
      });
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.querySelector('div').classList.remove('border-white/60', 'bg-white/20');
      fileInput.files = e.dataTransfer.files;
      updateFileList();
      checkFormValidity();
    });

    fileInput.addEventListener('change', () => {
      updateFileList();
      checkFormValidity();
    });
  }

  function updateFileList() {
    const files = fileInput.files;
    fileList.innerHTML = '';

    if (files.length > 0) {
      fileListContainer.classList.remove('hidden');
      Array.from(files).forEach(file => {
        const li = document.createElement('li');
        li.className = 'flex items-center p-2 rounded bg-white/5 border border-white/10 text-xs text-gray-200';

        // Ícone fixo para imagens
        const icon = '📸';
        li.innerHTML = `<span class="mr-2">${icon}</span> <span class="truncate">${file.name}</span>`;

        fileList.appendChild(li);
      });
    } else {
      fileListContainer.classList.add('hidden');
    }
  }

  // Adiciona listener para todos os inputs do formulário
  form.addEventListener('input', () => {
    checkFormValidity();
  });

  function checkFormValidity() {
    const nomeBase = document.getElementById('nome-base').value;
    const auditor = document.getElementById('auditor').value;
    const serial = document.getElementById('serial').value;
    const hasFiles = fileInput.files.length > 0;

    if (nomeBase.trim() !== '' && auditor.trim() !== '' && serial.trim() !== '' && hasFiles) {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    const baseValue = document.getElementById('nome-base').value;
    const auditorValue = document.getElementById('auditor').value;
    const serialValue = document.getElementById('serial').value;
    const files = Array.from(fileInput.files);

    try {
      let imageLinks = [];

      // 1. Upload das Imagens para o Supabase Storage
      if (SUPABASE_URL && SUPABASE_KEY) {
        submitBtn.textContent = 'Subindo imagens...';

        for (const file of files) {
          const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(`auditoria/${baseValue}/${fileName}`, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (error) throw error;

          // Pegar URL Pública
          const { data: { publicUrl } } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(`auditoria/${baseValue}/${fileName}`);

          imageLinks.push(publicUrl);
        }
      }

      // 2. Enviar dados para o Google Sheets
      submitBtn.textContent = 'Salvando na planilha...';
      const payload = {
        base: baseValue,
        auditor: auditorValue,
        serial: serialValue,
        data_envio: new Date().toLocaleString('pt-BR'),
        arquivos_quant: files.length,
        links: imageLinks.join(', '),
        status: "Enviado Completo"
      };

      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwiu5WvIJeHE0tmRk2I1_FH3Bh1woj_yNDSUmlOVomXQZPo6JWRQ542O5d0KCK4dkVrbA/exec';

      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      alert(`Sucesso! Auditoria ${baseValue} enviada com ${files.length} fotos salvas.`);
      form.reset();
      updateFileList();
      checkFormValidity();
    } catch (error) {
      console.error('Erro total no envio:', error);
      alert('Houve um erro no processo. Verifique as chaves do Supabase e as permissões do Bucket.');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

});

