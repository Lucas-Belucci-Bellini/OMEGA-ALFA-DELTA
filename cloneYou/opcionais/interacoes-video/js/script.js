const actions = document.querySelector("#video-actions");
const likeCount = document.querySelector("#like-count");
const saveLabel = document.querySelector("#save-label");
const commentForm = document.querySelector("#comment-form");
const commentInput = document.querySelector("#comment-input");
const commentList = document.querySelector("#comment-list");
const commentEmpty = document.querySelector("#comment-empty");
const commentCount = document.querySelector("#comment-count");
const toast = document.querySelector("#toast");
let toastTimeout;

const defaultState = {
    liked: false,
    disliked: false,
    saved: false,
    likes: 0,
    comments: []
};

// O estado é salvo no navegador para o aluno observar o localStorage funcionando.
let state = loadState();

function loadState() {
    try {
        return { ...defaultState, ...JSON.parse(localStorage.getItem("clonetube-interactions") || "{}") };
    } catch (error) {
        return { ...defaultState };
    }
}

function saveState() {
    localStorage.setItem("clonetube-interactions", JSON.stringify(state));
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function renderActions() {
    const likeButton = actions.querySelector('[data-action="like"]');
    const dislikeButton = actions.querySelector('[data-action="dislike"]');
    const saveButton = actions.querySelector('[data-action="save"]');

    likeButton.classList.toggle("is-active", state.liked);
    dislikeButton.classList.toggle("is-active", state.disliked);
    saveButton.classList.toggle("is-active", state.saved);
    likeButton.setAttribute("aria-pressed", String(state.liked));
    dislikeButton.setAttribute("aria-pressed", String(state.disliked));
    saveButton.setAttribute("aria-pressed", String(state.saved));
    likeCount.textContent = state.likes;
    saveLabel.textContent = state.saved ? "Salvo" : "Salvar";
}

function renderComments() {
    commentCount.textContent = state.comments.length;
    commentEmpty.hidden = state.comments.length > 0;
    commentList.innerHTML = state.comments.map((comment, index) => `
        <article class="comment">
            <span class="comment__avatar">EU</span>
            <div>
                <strong class="comment__author">Visitante</strong>
                <p class="comment__text"></p>
            </div>
            <button class="comment__remove" type="button" data-comment-index="${index}" aria-label="Remover comentário">×</button>
        </article>
    `).join("");

    // textContent evita que uma mensagem digitada vire HTML executável.
    state.comments.forEach((comment, index) => {
        commentList.querySelectorAll(".comment__text")[index].textContent = comment;
    });
}

function render() {
    renderActions();
    renderComments();
}

// Delegação de eventos: um único listener atende aos três botões de ação.
actions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;

    const action = button.dataset.action;
    if (action === "like") {
        state.liked = !state.liked;
        state.likes += state.liked ? 1 : -1;
        if (state.liked) state.disliked = false;
        showToast(state.liked ? "Você curtiu este vídeo." : "Curtida removida.");
    }

    if (action === "dislike") {
        state.disliked = !state.disliked;
        if (state.disliked && state.liked) {
            state.liked = false;
            state.likes = Math.max(0, state.likes - 1);
        }
        showToast(state.disliked ? "Feedback registrado." : "Feedback removido.");
    }

    if (action === "save") {
        state.saved = !state.saved;
        showToast(state.saved ? "Vídeo salvo na sua biblioteca." : "Vídeo removido da biblioteca.");
    }

    saveState();
    renderActions();
});

commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;
    state.comments.unshift(text);
    commentInput.value = "";
    saveState();
    renderComments();
    showToast("Comentário adicionado.");
});

commentList.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-comment-index]");
    if (!removeButton) return;
    state.comments.splice(Number(removeButton.dataset.commentIndex), 1);
    saveState();
    renderComments();
    showToast("Comentário removido.");
});

render();
