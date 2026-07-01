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
