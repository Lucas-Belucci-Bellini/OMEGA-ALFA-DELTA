const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("#menu-toggle");
const filters = document.querySelectorAll(".filter");
const timelineCards = document.querySelectorAll(".timeline-card");

// O menu só aparece em telas pequenas; aria-expanded informa seu estado aos leitores de tela.
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
document.querySelectorAll(".topbar__nav a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

// O filtro compara o data-filter do botão com o data-type de cada cartão.
filters.forEach((filterButton) => {
    filterButton.addEventListener("click", () => {
        const selectedFilter = filterButton.dataset.filter;

        filters.forEach((button) => button.classList.remove("is-active"));
        filterButton.classList.add("is-active");

        timelineCards.forEach((card) => {
            const shouldShow = selectedFilter === "all" || card.dataset.type === selectedFilter;
            card.hidden = !shouldShow;
        });
    });
});
