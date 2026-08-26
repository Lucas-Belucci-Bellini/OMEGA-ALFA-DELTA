const catalog = [
    { id: 1, title: "Como montar um setup minimalista", channel: "Rafa Tech", duration: "12:34", seconds: 754, category: "Tecnologia", thumb: "url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&q=80)" },
    { id: 2, title: "Playlist para trabalhar e estudar", channel: "Som de Fundo", duration: "1:02:18", seconds: 3738, category: "Música", thumb: "url(https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=700&q=80)" },
    { id: 3, title: "Cidade em 30 dias no modo sobrevivência", channel: "Lipe Play", duration: "28:46", seconds: 1726, category: "Jogos", thumb: "url(https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=700&q=80)" },
    { id: 4, title: "Interface moderna do zero", channel: "Código Aberto", duration: "34:21", seconds: 2061, category: "Programação", thumb: "url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=700&q=80)" },
    { id: 5, title: "Melhores momentos do festival", channel: "Cena Livre", duration: "09:58", seconds: 598, category: "Música", thumb: "url(https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=700&q=80)" },
    { id: 6, title: "Dica de produtividade em 42 segundos", channel: "Clube do Foco", duration: "00:42", seconds: 42, category: "Shorts", thumb: "url(https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=700&q=80)" }
];

const elements = {
    library: document.querySelector("#library-grid"),
    search: document.querySelector("#library-search"),
    queue: document.querySelector("#queue-list"),
    queueEmpty: document.querySelector("#queue-empty"),
    queueCount: document.querySelector("#queue-count"),
    queueTime: document.querySelector("#queue-time"),
    queueLabel: document.querySelector("#queue-label"),
    watchedCount: document.querySelector("#watched-count"),
    nowTitle: document.querySelector("#now-playing-title"),
    nowMeta: document.querySelector("#now-playing-meta"),
    progress: document.querySelector("#progress-bar"),
    markWatched: document.querySelector("#mark-watched"),
    shuffle: document.querySelector("#shuffle-queue"),
    clear: document.querySelector("#clear-queue"),
    toast: document.querySelector("#toast")
};

const state = {
    queue: loadQueue(),
    currentId: null,
    watched: loadWatched(),
    query: ""
};

function loadQueue() {
    try {
        return JSON.parse(localStorage.getItem("clonetube-queue") || "[]");
    } catch (error) {
        return [];
    }
}

function loadWatched() {
    try {
        return JSON.parse(localStorage.getItem("clonetube-watched") || "[]");
    } catch (error) {
        return [];
    }
}

function persist() {
    localStorage.setItem("clonetube-queue", JSON.stringify(state.queue));
    localStorage.setItem("clonetube-watched", JSON.stringify(state.watched));
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;
    return hours > 0
        ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`
        : `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function getVideo(id) {
    return catalog.find((video) => video.id === Number(id));
}

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => elements.toast.classList.remove("is-visible"), 2500);
}

function renderLibrary() {
    const normalized = state.query.trim().toLocaleLowerCase();
    const visibleVideos = catalog.filter((video) => `${video.title} ${video.channel} ${video.category}`.toLocaleLowerCase().includes(normalized));

    elements.library.innerHTML = visibleVideos.map((video) => {
        const isAdded = state.queue.includes(video.id);
        const isWatched = state.watched.includes(video.id);
        return `
            <article class="video-card ${isWatched ? "is-watched" : ""}">
                <div class="video-card__thumb" style="--thumb:${video.thumb}">
                    <span class="video-card__duration">${video.duration}</span>
                </div>
                <div class="video-card__body">
                    <h3>${video.title}</h3>
                    <p>${video.channel} · ${video.category}</p>
                    <div class="video-card__actions">
                        <button class="card-button card-button--play" type="button" data-action="play" data-id="${video.id}">▶ Reproduzir</button>
                        <button class="card-button ${isAdded ? "is-added" : ""}" type="button" data-action="queue" data-id="${video.id}">${isAdded ? "✓ Na fila" : "+ Adicionar"}</button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function renderQueue() {
    const totalSeconds = state.queue.reduce((total, id) => total + (getVideo(id)?.seconds || 0), 0);
    elements.queueCount.textContent = state.queue.length;
    elements.queueTime.textContent = formatTime(totalSeconds);
    elements.queueLabel.textContent = `${state.queue.length} ${state.queue.length === 1 ? "vídeo" : "vídeos"}`;
    elements.watchedCount.textContent = state.watched.length;
    elements.queueEmpty.hidden = state.queue.length > 0;

    elements.queue.innerHTML = state.queue.map((id, index) => {
        const video = getVideo(id);
        if (!video) return "";
        return `
            <div class="queue-item" data-id="${video.id}">
                <span class="queue-item__index">${index + 1}</span>
                <span class="queue-item__thumb" style="--thumb:${video.thumb}"></span>
                <button class="queue-item__play" type="button" data-action="play" data-id="${video.id}">
                    <span class="queue-item__title">${video.title}</span>
                    <span class="queue-item__meta">${video.channel} · ${video.duration}</span>
                </button>
                <button class="queue-item__remove" type="button" aria-label="Remover ${video.title}" data-action="remove" data-id="${video.id}">×</button>
            </div>
        `;
    }).join("");
}

function renderCurrent() {
    const video = getVideo(state.currentId);
    if (!video) {
        elements.nowTitle.textContent = "Escolha um vídeo da biblioteca";
        elements.nowMeta.textContent = "Sua fila aparecerá aqui.";
        elements.progress.style.width = "0%";
        elements.markWatched.disabled = true;
        return;
    }

    elements.nowTitle.textContent = video.title;
    elements.nowMeta.textContent = `${video.channel} · ${video.category} · ${video.duration}`;
    elements.progress.style.width = state.watched.includes(video.id) ? "100%" : "35%";
    elements.markWatched.disabled = state.watched.includes(video.id);
    elements.markWatched.textContent = state.watched.includes(video.id) ? "✓ Já assistido" : "Marcar como assistido";
}

function render() {
    renderLibrary();
    renderQueue();
    renderCurrent();
}

function addToQueue(id) {
    const video = getVideo(id);
    if (!video || state.queue.includes(video.id)) {
        showToast("Esse vídeo já está na sua fila.");
        return;
    }
    state.queue.push(video.id);
    if (!state.currentId) state.currentId = video.id;
    persist();
    render();
    showToast(`${video.title} foi adicionado à fila.`);
}

function removeFromQueue(id) {
    state.queue = state.queue.filter((queueId) => queueId !== Number(id));
    if (state.currentId === Number(id)) state.currentId = state.queue[0] || null;
    persist();
    render();
    showToast("Vídeo removido da fila.");
}

function playVideo(id) {
    const video = getVideo(id);
    if (!video) return;
    state.currentId = video.id;
    renderCurrent();
    showToast(`Reproduzindo: ${video.title}`);
}

function shuffleQueue() {
    state.queue = [...state.queue].sort(() => Math.random() - 0.5);
    persist();
    renderQueue();
    showToast("Fila embaralhada.");
}

function clearQueue() {
    state.queue = [];
    state.currentId = null;
    persist();
    render();
    showToast("Fila limpa.");
}

elements.search.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderLibrary();
});

elements.library.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const action = actionButton.dataset.action;
    if (action === "queue") addToQueue(actionButton.dataset.id);
    if (action === "play") playVideo(actionButton.dataset.id);
});

elements.queue.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    if (actionButton.dataset.action === "remove") removeFromQueue(actionButton.dataset.id);
    if (actionButton.dataset.action === "play") playVideo(actionButton.dataset.id);
});

elements.markWatched.addEventListener("click", () => {
    if (!state.currentId || state.watched.includes(state.currentId)) return;
    state.watched.push(state.currentId);
    persist();
    render();
    showToast("Vídeo marcado como assistido.");
});

elements.shuffle.addEventListener("click", shuffleQueue);
elements.clear.addEventListener("click", clearQueue);

render();
