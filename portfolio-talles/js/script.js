const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("#menu-toggle");
const toast = document.querySelector("#toast");
const toastTriggers = document.querySelectorAll("[data-toast]");
let toastTimeout;

// O menu mobile usa uma classe no cabeçalho para abrir e fechar a navegação.
function setMenu(isOpen) {
    topbar.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

menuToggle.addEventListener("click", () => {
    setMenu(!topbar.classList.contains("menu-open"));
});

// Sem isto o menu continuaria aberto por cima da seção que o visitante
// acabou de escolher — e ele teria que descobrir sozinho como fechá-lo.
document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

// Cada botão possui sua própria mensagem no atributo data-toast.
toastTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => showToast(trigger.dataset.toast));
});
