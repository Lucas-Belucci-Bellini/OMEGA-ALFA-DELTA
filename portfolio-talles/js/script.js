const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("#menu-toggle");
const toast = document.querySelector("#toast");
const toastTriggers = document.querySelectorAll("[data-toast]");
let toastTimeout;

// O menu mobile usa uma classe no cabeçalho para abrir e fechar a navegação.
menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
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
