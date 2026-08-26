const videoCatalog = [
    {
        id: 1,
        title: "Como montar um setup minimalista que realmente funciona",
        channel: "Rafa Tech",
        avatar: "RT",
        avatarClass: "avatar--blue",
        category: "Tecnologia",
        sections: ["Todos", "Tecnologia", "Em alta", "Inscrições", "Assistir mais tarde"],
        views: "1,2 mi de visualizações",
        age: "há 2 dias",
        duration: "12:34",
        verified: true,
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 2,
        title: "A playlist perfeita para trabalhar, estudar e criar",
        channel: "Som de Fundo",
        avatar: "SF",
        avatarClass: "avatar--purple",
        category: "Música",
        sections: ["Todos", "Música", "Mixes", "Inscrições", "Playlists"],
        views: "846 mil visualizações",
        age: "há 5 horas",
        duration: "1:02:18",
        verified: true,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 3,
        title: "Construí uma cidade inteira em 30 dias no modo sobrevivência",
        channel: "Lipe Play",
        avatar: "LP",
        avatarClass: "avatar--orange",
        category: "Jogos",
        sections: ["Todos", "Jogos", "Em alta", "Inscrições", "Vídeos com gostei"],
        views: "2,8 mi de visualizações",
        age: "há 1 semana",
        duration: "28:46",
        verified: false,
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 4,
        title: "O que ninguém te conta sobre viajar sozinho",
        channel: "Mundo Aberto",
        avatar: "MA",
        avatarClass: "avatar--green",
        category: "Viagem",
        sections: ["Todos", "Viagem", "Em alta", "Assistir mais tarde"],
        views: "394 mil visualizações",
        age: "há 3 dias",
        duration: "18:09",
        verified: true,
        image: "https://images.unsplash.com/photo-1526481280695-3c687fd5432c?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 5,
        title: "Programando uma interface moderna do zero",
        channel: "Código Aberto",
        avatar: "CA",
        avatarClass: "avatar--rose",
        category: "Programação",
        sections: ["Todos", "Programação", "Tecnologia", "Seus vídeos", "Histórico"],
        views: "212 mil visualizações",
        age: "há 9 horas",
        duration: "34:21",
        verified: true,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 6,
        title: "AO VIVO: noite de jogos com a comunidade",
        channel: "Nina Games",
        avatar: "NG",
        avatarClass: "avatar--black",
        category: "Ao vivo",
        sections: ["Todos", "Ao vivo", "Jogos", "Inscrições"],
        views: "Ao vivo agora",
        age: "",
        duration: "AO VIVO",
        live: true,
        verified: false,
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 7,
        title: "Design de produto: 7 decisões que mudam tudo",
        channel: "Forma & Função",
        avatar: "FF",
        avatarClass: "avatar--blue",
        category: "Design",
        sections: ["Todos", "Design", "Tecnologia", "Em alta", "Vídeos com gostei"],
        views: "628 mil visualizações",
        age: "há 4 dias",
        duration: "16:42",
        verified: true,
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 8,
        title: "Os melhores momentos do festival que parou a cidade",
        channel: "Cena Livre",
        avatar: "CL",
        avatarClass: "avatar--purple",
        category: "Música",
        sections: ["Todos", "Música", "Ao vivo", "Em alta", "Histórico"],
        views: "3,1 mi de visualizações",
        age: "há 2 semanas",
        duration: "09:58",
        verified: false,
        image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 9,
        title: "Uma manhã de café, leitura e ideias novas",
        channel: "Casa Lenta",
        avatar: "CL",
        avatarClass: "avatar--orange",
        category: "Lifestyle",
        sections: ["Todos", "Playlists", "Assistir mais tarde", "Vídeos com gostei"],
        views: "178 mil visualizações",
        age: "há 6 dias",
        duration: "08:17",
        verified: false,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 10,
        title: "Short: a dica de produtividade que eu queria ter ouvido antes",
        channel: "Clube do Foco",
        avatar: "CF",
        avatarClass: "avatar--green",
        category: "Shorts",
        sections: ["Todos", "Shorts", "Em alta", "Inscrições"],
        views: "4,7 mi de visualizações",
        age: "há 1 dia",
        duration: "0:42",
        verified: true,
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 11,
        title: "Comédia: quando você tenta cozinhar seguindo a internet",
        channel: "Risada Garantida",
        avatar: "RG",
        avatarClass: "avatar--rose",
        category: "Comédia",
        sections: ["Todos", "Comédia", "Em alta", "Vídeos com gostei"],
        views: "987 mil visualizações",
        age: "há 3 semanas",
        duration: "07:31",
        verified: false,
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=85"
    },
    {
        id: 12,
        title: "Como organizar suas finanças em uma planilha simples",
        channel: "Vida Prática",
        avatar: "VP",
        avatarClass: "avatar--blue",
        category: "Educação",
        sections: ["Todos", "Histórico", "Seus vídeos", "Assistir mais tarde"],
        views: "521 mil visualizações",
        age: "há 8 dias",
        duration: "21:05",
        verified: true,
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=900&q=85"
    }
];

// Estado da tela: o JavaScript guarda aqui o que o aluno vê na busca e nos filtros.
// Quando um valor muda, renderVideos() desenha novamente apenas os cards.
const state = {
    query: "",
    filter: "Todos",
    section: "Início"
};

const elements = {
    grid: document.querySelector("#videos-grid"),
    empty: document.querySelector("#empty-state"),
    count: document.querySelector("#results-count"),
    title: document.querySelector("#section-title"),
    searchInput: document.querySelector("#search-input"),
    searchForm: document.querySelector("#search-form"),
    categoryChips: document.querySelector("#category-chips"),
    sidebar: document.querySelector("#sidebar"),
    menuToggle: document.querySelector("#menu-toggle"),
    toast: document.querySelector("#toast"),
    modal: document.querySelector("#video-modal"),
    modalTitle: document.querySelector("#modal-title"),
    modalChannel: document.querySelector("#modal-channel"),
    clearSearch: document.querySelector("#clear-search"),
    voiceButton: document.querySelector("#voice-button"),
    themeToggle: document.querySelector("#theme-toggle"),
    themeMeta: document.querySelector('meta[name="theme-color"]'),
    topbar: document.querySelector(".topbar")
};

const sectionTitles = {
    "Início": "Recomendados",
    "Shorts": "Shorts para você",
    "Inscrições": "Dos canais que você segue",
    "Histórico": "Assistidos recentemente",
    "Playlists": "Suas playlists",
    "Seus vídeos": "Seus vídeos",
    "Assistir mais tarde": "Assistir mais tarde",
    "Vídeos com gostei": "Vídeos com gostei",
    "Em alta": "Em alta"
};

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#039;",
        '"': "&quot;"
    }[character]));
}

function getVisibleVideos() {
    const normalizedQuery = state.query.trim().toLocaleLowerCase();

    return videoCatalog.filter((video) => {
        const matchesFilter = state.filter === "Todos" || video.sections.includes(state.filter);
        const searchableText = `${video.title} ${video.channel} ${video.category}`.toLocaleLowerCase();
        const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
        return matchesFilter && matchesQuery;
    });
}

function createVideoCard(video) {
    const verifiedMark = video.verified
        ? '<i class="fa-solid fa-circle-check" aria-label="Canal verificado"></i>'
        : "";
    const metadata = video.live
        ? `<span class="live-label"><i class="fa-solid fa-circle"></i> ${escapeHtml(video.views)}</span>`
        : `${escapeHtml(video.views)} · ${escapeHtml(video.age)}`;

    return `
        <article class="video-card" tabindex="0" data-video-id="${video.id}" aria-label="Abrir vídeo: ${escapeHtml(video.title)}">
            <div class="video-card__thumb" style="background-image: url('${video.image}')">
                <span class="video-card__duration ${video.live ? "video-card__duration--live" : ""}">${escapeHtml(video.duration)}</span>
            </div>
            <div class="video-card__body">
                <span class="avatar avatar--card ${video.avatarClass}">${escapeHtml(video.avatar)}</span>
                <div class="video-card__copy">
                    <h2 class="video-card__title">${escapeHtml(video.title)}</h2>
                    <p class="video-card__channel">${escapeHtml(video.channel)} ${verifiedMark}</p>
                    <p class="video-card__meta">${metadata}</p>
                </div>
                <button class="video-card__menu" type="button" aria-label="Mais opções" data-toast="Mais opções para este vídeo em breve.">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>
            </div>
        </article>
    `;
}

// Filtra o catálogo e atualiza o conteúdo que aparece no HTML.
function renderVideos() {
    const videos = getVisibleVideos();
    const hasSearch = Boolean(state.query.trim());

    elements.title.textContent = hasSearch ? `Resultados para “${state.query.trim()}”` : (sectionTitles[state.section] || state.section);
    elements.count.textContent = `${videos.length} ${videos.length === 1 ? "vídeo" : "vídeos"}`;
    elements.grid.innerHTML = videos.map(createVideoCard).join("");
    elements.empty.hidden = videos.length !== 0;
    elements.grid.hidden = videos.length === 0;
}

function updateActiveControls() {
    document.querySelectorAll(".chip").forEach((chip) => {
        chip.classList.toggle("is-active", chip.dataset.filter === state.filter);
    });

    document.querySelectorAll(".sidebar__item, .mobile-nav__item").forEach((item) => {
        const isActive = item.dataset.section === state.section;
        item.classList.toggle("is-active", isActive);
    });
}

function setFilter(filter, section = filter === "Todos" ? "Início" : filter) {
    state.filter = filter;
    state.section = section;
    updateActiveControls();
    renderVideos();
}

let toastTimeout;
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => elements.toast.classList.remove("is-visible"), 2800);
}

function openModal(video) {
    elements.modalTitle.textContent = video.title;
    elements.modalChannel.textContent = `${video.channel} · ${video.views}`;
    elements.modal.hidden = false;
    document.body.classList.add("modal-open");
}

function closeModal() {
    elements.modal.hidden = true;
    document.body.classList.remove("modal-open");
}

function submitSearch(event) {
    event.preventDefault();
    state.query = elements.searchInput.value;
    state.filter = "Todos";
    state.section = "Início";
    updateActiveControls();
    renderVideos();
}

function clearSearch() {
    state.query = "";
    state.filter = "Todos";
    state.section = "Início";
    elements.searchInput.value = "";
    updateActiveControls();
    renderVideos();
}

// No desktop, o menu fica compacto; no mobile, ele abre como um drawer.
// matchMedia() permite escolher o comportamento de acordo com a largura da tela.
function toggleSidebar() {
    const isMobile = window.matchMedia("(max-width: 48rem)").matches;

    if (isMobile) {
        document.body.classList.toggle("sidebar-open");
        const isOpen = document.body.classList.contains("sidebar-open");
        elements.menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
        elements.menuToggle.setAttribute("aria-expanded", String(isOpen));
        return;
    }

    document.body.classList.toggle("sidebar-collapsed");
    const isCollapsed = document.body.classList.contains("sidebar-collapsed");
    elements.menuToggle.setAttribute("aria-label", isCollapsed ? "Expandir menu" : "Recolher menu");
    elements.menuToggle.setAttribute("aria-expanded", String(!isCollapsed));
}

function readSavedTheme() {
    try {
        return localStorage.getItem("clonetube-theme");
    } catch (error) {
        return null;
    }
}

// Troca o tema alterando um atributo no elemento <html>.
// O CSS usa html[data-theme="dark"] para aplicar somente as cores escuras.
function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";

    if (elements.themeToggle) {
        elements.themeToggle.classList.toggle("is-dark", isDark);
        elements.themeToggle.setAttribute("aria-pressed", String(isDark));
        elements.themeToggle.setAttribute("aria-label", isDark ? "Ativar modo claro" : "Ativar modo escuro");
        elements.themeToggle.querySelector("i").className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
    }

    if (elements.themeMeta) elements.themeMeta.content = isDark ? "#0f0f0f" : "#ffffff";

    try {
        localStorage.setItem("clonetube-theme", isDark ? "dark" : "light");
    } catch (error) {
        // O modo continua funcionando mesmo quando o navegador bloqueia o armazenamento local.
    }
}

function toggleTheme() {
    const isDark = document.documentElement.dataset.theme === "dark";
    applyTheme(isDark ? "light" : "dark");
}

function startVoiceSearch() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
        showToast("A pesquisa por voz não é compatível com este navegador.");
        return;
    }

    const recognition = new Recognition();
    recognition.lang = "pt-BR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    elements.voiceButton.classList.add("is-listening");

    recognition.addEventListener("result", (event) => {
        elements.searchInput.value = event.results[0][0].transcript;
        state.query = elements.searchInput.value;
        state.filter = "Todos";
        state.section = "Início";
        updateActiveControls();
        renderVideos();
    });

    recognition.addEventListener("end", () => elements.voiceButton.classList.remove("is-listening"));
    recognition.addEventListener("error", () => {
        elements.voiceButton.classList.remove("is-listening");
        showToast("Não foi possível captar sua voz. Tente novamente.");
    });
    recognition.start();
}

elements.searchForm.addEventListener("submit", submitSearch);
elements.clearSearch.addEventListener("click", clearSearch);
elements.menuToggle.addEventListener("click", toggleSidebar);
elements.voiceButton.addEventListener("click", startVoiceSearch);
if (elements.themeToggle) elements.themeToggle.addEventListener("click", toggleTheme);

elements.categoryChips.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    setFilter(chip.dataset.filter, chip.dataset.filter === "Todos" ? "Início" : chip.dataset.filter);
});

document.addEventListener("click", (event) => {
    const toastTrigger = event.target.closest("[data-toast]");
    if (toastTrigger) {
        event.preventDefault();
        showToast(toastTrigger.dataset.toast);
        return;
    }

    const navItem = event.target.closest("[data-filter]");
    if (navItem && !navItem.classList.contains("chip")) {
        event.preventDefault();
        setFilter(navItem.dataset.filter, navItem.dataset.section || navItem.dataset.filter);
        document.body.classList.remove("sidebar-open");
        return;
    }

    const card = event.target.closest(".video-card");
    if (card) {
        const video = videoCatalog.find((item) => item.id === Number(card.dataset.videoId));
        if (video) openModal(video);
    }

    if (event.target.closest("[data-close-modal]")) closeModal();

    if (
        document.body.classList.contains("sidebar-open") &&
        window.matchMedia("(max-width: 48rem)").matches &&
        !event.target.closest("#sidebar, #menu-toggle")
    ) {
        document.body.classList.remove("sidebar-open");
        elements.menuToggle.setAttribute("aria-label", "Abrir menu");
        elements.menuToggle.setAttribute("aria-expanded", "false");
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();

    const card = event.target.closest(".video-card");
    if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        const video = videoCatalog.find((item) => item.id === Number(card.dataset.videoId));
        if (video) openModal(video);
    }
});

window.addEventListener("scroll", () => {
    elements.topbar.classList.toggle("is-scrolled", window.scrollY > 8);
}, { passive: true });

const preferredTheme = readSavedTheme() || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
applyTheme(preferredTheme);
renderVideos();
updateActiveControls();

/*
 * GUIA PARA OS ALUNOS
 *
 * state guarda a busca, o filtro e a seção atual. renderVideos() lê esse estado
 * e redesenha somente a área de cards. toggleSidebar() alterna classes no body:
 * sidebar-collapsed no desktop e sidebar-open no mobile. applyTheme() altera o
 * atributo data-theme do html e salva a escolha no localStorage.
 */
