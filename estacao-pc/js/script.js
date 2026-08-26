const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("#menu-toggle");
const buildTabs = document.querySelectorAll(".build-tab");
const partsList = document.querySelector("#parts-list");
const toast = document.querySelector("#toast");
const toastTriggers = document.querySelectorAll("[data-toast]");
let toastTimeout;

const profiles = {
    essencial: {
        code: "PROFILE / ESSENCIAL",
        title: "Para aprender, pesquisar e criar sem complicação.",
        description: "Um ponto de partida equilibrado para tarefas do dia a dia e projetos escolares.",
        parts: ["Ryzen 5 / Core i5", "16 GB DDR4", "SSD NVMe 500 GB", "Fonte 500 W"]
    },
    criador: {
        code: "PROFILE / CRIADOR",
        title: "Para editar, programar e transformar ideias em projetos.",
        description: "Mais memória e armazenamento para manter ferramentas criativas abertas ao mesmo tempo.",
        parts: ["Ryzen 7 / Core i7", "32 GB DDR5", "SSD NVMe 1 TB", "Fonte 650 W"]
    },
    jogador: {
        code: "PROFILE / JOGADOR",
        title: "Para jogar com fluidez e aproveitar cada detalhe.",
        description: "Uma configuração focada em placa de vídeo, refrigeração e espaço para upgrades.",
        parts: ["Ryzen 7 / Core i7", "32 GB DDR5", "GPU dedicada 12 GB", "Fonte 750 W"]
    }
};

function renderProfile(profileName) {
    const profile = profiles[profileName];
    if (!profile) return;

    document.querySelector(".build-panel__code").textContent = profile.code;
    document.querySelector(".build-panel__intro h3").textContent = profile.title;
    document.querySelector(".build-panel__intro p").textContent = profile.description;
    partsList.innerHTML = profile.parts.map((part, index) => `
        <div class="part">
            <span class="part__index">0${index + 1}</span>
            <span class="part__name">${part}</span>
            <span class="part__choice">sugestão</span>
        </div>
    `).join("");
}

// A aba ativa troca os dados do painel sem recarregar a página.
buildTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        buildTabs.forEach((button) => {
            button.classList.remove("is-active");
            button.setAttribute("aria-selected", "false");
        });
        tab.classList.add("is-active");
        tab.setAttribute("aria-selected", "true");
        renderProfile(tab.dataset.build);
    });
});

// O menu recebe a classe menu-open para mostrar a navegação em telas pequenas.
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

toastTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => showToast(trigger.dataset.toast));
});

renderProfile("essencial");
