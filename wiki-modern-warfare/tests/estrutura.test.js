// Teste estrutural do wiki-modern-warfare — roda com "node --test tests/*.test.js".
// Sem instalar nada: confere o que quebra a pagina em silencio.
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
    const ancoras = [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]);
    for (const alvo of new Set(ancoras)) {
        assert.ok(html.includes(`id="${alvo}"`), `a ancora #${alvo} nao tem destino no HTML`);
    }
});

test("toda imagem tem alt", () => {
    for (const img of html.match(/<img[^>]*>/g) || []) {
        assert.match(img, /\salt="/, `imagem sem alt: ${img}`);
    }
});

test("nao ha imagem na pasta assets que ninguem use", () => {
    const pasta = path.join(raiz, "assets");
    if (!fs.existsSync(pasta)) return;

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

test("[hidden] esta protegido no CSS", () => {
    // O filtro da linha do tempo esconde cartoes pelo atributo hidden. Sem esta
    // regra, bastaria alguem definir display em .timeline-card para o filtro
    // parar de esconder — sem nenhum erro no console.
    assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});

test("os elementos que o JavaScript procura existem no HTML", () => {
    for (const [, id] of js.matchAll(/querySelector\("#([\w-]+)"\)/g)) {
        assert.ok(html.includes(`id="${id}"`), `o script procura #${id}, que nao existe no HTML`);
    }
    for (const [, classe] of js.matchAll(/querySelectorAll?\("\.([\w-]+)/g)) {
        assert.ok(html.includes(`class="${classe}`) || html.includes(` ${classe}`) || html.includes(`"${classe}"`),
            `o script procura .${classe}, que nao aparece no HTML`);
    }
});

test("o botao de menu declara aria-expanded e aria-label", () => {
    const botao = (html.match(/<button[^>]*id="menu-toggle"[^>]*>/) || [])[0];
    assert.ok(botao, "botao #menu-toggle nao encontrado");
    assert.match(botao, /aria-expanded="/);
    assert.match(botao, /aria-label="/);
});

test("os links do menu fecham o menu", () => {
    // Regressao do defeito D1: antes, o menu ficava aberto por cima da secao
    // escolhida. O tratamento precisa existir no script.
    assert.match(js, /\.topbar__nav a/, "nao ha tratamento para os links do menu");
});
