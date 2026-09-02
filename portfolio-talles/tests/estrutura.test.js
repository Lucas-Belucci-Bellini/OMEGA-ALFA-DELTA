// Teste estrutural do portfolio-talles — roda com "node --test tests/*.test.js".
//
// Este arquivo se parece com o dos outros projetos de propósito. Um helper
// compartilhado criaria justamente a amarra entre projetos que a reorganização
// desfez: cada pasta tem que rodar sozinha, sem depender de nada fora dela.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
const css = fs.readFileSync(path.join(raiz, "css", "style.css"), "utf8");
const js = fs.readFileSync(path.join(raiz, "js", "script.js"), "utf8");

function referenciasLocais(conteudo) {
    return (conteudo.match(/(?:href|src)="([^"]+)"/g) || [])
        .map((item) => item.replace(/^(?:href|src)="/, "").replace(/"$/, ""))
        .filter((valor) => !/^(https?:|\/\/|#|mailto:|javascript:|data:)/.test(valor));
}

test("todo caminho local do HTML resolve e nao sai da pasta do projeto", () => {
    for (const referencia of referenciasLocais(html)) {
        assert.ok(!referencia.startsWith("../"), `sai da pasta do projeto: ${referencia}`);
        assert.ok(
            fs.existsSync(path.join(raiz, referencia.split(/[?#]/)[0])),
            `referencia quebrada: ${referencia}`
        );
    }
});

test("nenhuma ancora aponta para uma secao que nao existe", () => {
    for (const [, alvo] of html.matchAll(/href="#([\w-]+)"/g)) {
        assert.ok(html.includes(`id="${alvo}"`), `a ancora #${alvo} nao tem destino no HTML`);
    }
});

test("nao ha pasta assets com arquivo sem uso", () => {
    const pasta = path.join(raiz, "assets");
    if (!fs.existsSync(pasta)) return; // o projeto nao tem imagem local — e isso e valido

    for (const arquivo of fs.readdirSync(pasta)) {
        const usada = html.includes(arquivo) || css.includes(arquivo) || js.includes(arquivo);
        assert.ok(usada, `assets/${arquivo} nao e usado por HTML, CSS nem JS`);
    }
});

test("o link externo em nova aba tem rel=noopener", () => {
    for (const link of html.match(/<a[^>]*target="_blank"[^>]*>/g) || []) {
        assert.match(link, /rel="[^"]*noopener/, `link sem noopener: ${link}`);
    }
});

// Regressao do defeito D2 da auditoria.
test("todo botao tem nome acessivel de verdade", () => {
    // Um botao cujo conteudo e so um simbolo (☰, ↗) nao tem nome util: o leitor
    // de tela anuncia o desenho. Nesse caso o aria-label deixa de ser opcional.
    const soSimbolos = /^[\s -㌀︀-️]*$/;

    for (const botao of html.match(/<button[^>]*>[\s\S]*?<\/button>/g) || []) {
        const texto = botao.replace(/<[^>]+>/g, "").trim();
        if (texto && !soSimbolos.test(texto)) continue;
        assert.match(
            botao,
            /aria-label="[^"]+"/,
            `botao sem nome acessivel (conteudo: ${JSON.stringify(texto)})`
        );
    }
});

test("os links do menu fecham o menu", () => {
    assert.match(js, /\.nav a/, "nao ha tratamento para os links do menu");
});

test("o HTML declara idioma, codificacao, viewport e descricao", () => {
    assert.match(html, /<html lang="pt-BR">/);
    assert.match(html, /<meta charset="UTF-8">/i);
    assert.match(html, /name="viewport"/);
    assert.match(html, /name="description"/);
});
