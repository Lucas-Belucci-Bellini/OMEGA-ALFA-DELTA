const toggleButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (toggleButton && nav) {
  toggleButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('form-result');

if (contactForm && formResult) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formResult.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
    contactForm.reset();
  });
}

// Handler para o novo formulário multi-tipo
const multiForm = document.querySelector('.multi-form');
if (multiForm) {
  multiForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Coletar dados do formulário
    const formData = new FormData(multiForm);
    const dados = Object.fromEntries(formData);
    
    // Exibir alerta com os dados
    alert('Formulário enviado com sucesso!\n\nDados coletados:\n' + JSON.stringify(dados, null, 2));
    
    multiForm.reset();
  });
}

// Handler para o formulário de cadastro
const cadastroForm = document.getElementById('cadastroForm');
const cadastroResult = document.getElementById('cadastro-result');

if (cadastroForm && cadastroResult) {
  cadastroForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Coletar dados do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email-cadastro').value;
    const senha = document.getElementById('senha-cadastro').value;
    const cidade = document.getElementById('cidade').value;
    const genero = document.getElementById('genero').value;
    const termos = document.querySelector('input[name="termos"]').checked;
    
    // Validar se os termos foram aceitos
    if (!termos) {
      cadastroResult.textContent = 'Por favor, aceite os termos e condições para continuar.';
      cadastroResult.style.color = '#dc2626';
      return;
    }
    
    // Exibir mensagem de sucesso
    cadastroResult.textContent = `Cadastro realizado com sucesso! Bem-vindo ${nome}! Um e-mail de confirmação foi enviado para ${email}.`;
    cadastroResult.style.color = var(--secondary);
    
    // Limpar o formulário
    cadastroForm.reset();
    
    // Limpar mensagem após 5 segundos
    setTimeout(() => {
      cadastroResult.textContent = '';
    }, 5000);
  });
}

const canvas = document.getElementById('demoCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let offset = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 40; i += 1) {
      const x = (i * 35 + offset) % canvas.width;
      const y = 40 + (i % 5) * 30;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    }

    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 180);
    ctx.quadraticCurveTo(140, 100, 260, 140);
    ctx.quadraticCurveTo(360, 170, 580, 60);
    ctx.stroke();

    offset = (offset + 2) % canvas.width;
    requestAnimationFrame(draw);
  }

  draw();
}
