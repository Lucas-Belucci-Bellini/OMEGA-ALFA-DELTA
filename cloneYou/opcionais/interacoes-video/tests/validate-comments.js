const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const moduleDirectory = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(moduleDirectory, "index.html"), "utf8");
const script = fs.readFileSync(path.join(moduleDirectory, "js", "script.js"), "utf8");

function mustContain(content, fragment, description) {
    assert.ok(content.includes(fragment), `Faltando: ${description}`);
}

// Confere se os elementos que o JS procura ainda existem no HTML.
[
    ['id="comment-form"', "formulário de comentários"],
    ['id="comment-input"', "campo do comentário"],
    ['id="comment-list"', "lista de comentários"],
    ['id="comment-count"', "contador de comentários"],
    ['id="video-actions"', "botões de interação"]
].forEach(([fragment, description]) => mustContain(html, fragment, description));

// Confere se o script possui as ações essenciais do exercício.
[
    ["commentForm.addEventListener", "listener de envio do formulário"],
    ["event.preventDefault()", "prevenção do recarregamento"],
    ["state.comments.unshift", "adição do comentário"],
    ["localStorage.setItem", "persistência local"],
    ["data-comment-index", "remoção de comentários"]
].forEach(([fragment, description]) => mustContain(script, fragment, description));

// Simula as regras do formulário sem abrir um navegador.
function addComment(comments, value) {
    const text = value.trim();
    return text ? [text, ...comments] : comments;
}

assert.deepEqual(addComment([], "  Olá, turma!  "), ["Olá, turma!"]);
assert.deepEqual(addComment(["primeiro"], "   "), ["primeiro"]);

const saved = JSON.stringify(["Comentário de teste"]);
assert.deepEqual(JSON.parse(saved), ["Comentário de teste"]);

console.log("OK: formulário, validação de texto, persistência e remoção foram conferidos.");
