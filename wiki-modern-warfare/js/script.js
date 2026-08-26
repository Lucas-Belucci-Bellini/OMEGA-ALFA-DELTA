const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector("#menu-toggle");
const filters = document.querySelectorAll(".filter");
const timelineCards = document.querySelectorAll(".timeline-card");

// O menu só aparece em telas pequenas; aria-expanded informa seu estado aos leitores de tela.
menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
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
