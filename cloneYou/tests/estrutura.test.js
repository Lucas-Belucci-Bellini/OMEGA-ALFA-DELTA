// Teste estrutural do cloneYou — roda com "node --test", sem instalar nada.
// Ele confere o que quebra a pagina em silencio: um caminho errado no HTML.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");

function existe(...partes) {
    return fs.existsSync(path.join(raiz, ...partes));
}

// Pega todo href/src do HTML e descarta o que nao e arquivo local
// (links externos, ancoras "#alguma-coisa" e "javascript:").
function referenciasLocais(conteudo) {
    const encontradas = conteudo.match(/(?:href|src)="([^"]+)"/g) || [];
    return encontradas
        .map((item) => item.replace(/^(?:href|src)="/, "").replace(/"$/, ""))
        .filter((valor) => !/^(https?:|\/\/|#|mailto:|javascript:|data:)/.test(valor));
}

test("o arquivo principal existe", () => {
    assert.ok(existe("index.html"));
});

test("o CSS e o JS que o HTML pede existem no disco", () => {
    assert.ok(existe("css", "style.css"), "css/style.css nao encontrado");
    assert.ok(existe("js", "script.js"), "js/script.js nao encontrado");
});

test("todo caminho local citado no HTML resolve", () => {
    for (const referencia of referenciasLocais(html)) {
        const alvo = path.join(raiz, referencia.split(/[?#]/)[0]);
        assert.ok(fs.existsSync(alvo), `referencia quebrada no index.html: ${referencia}`);
    }
});

test("o projeto nao depende de arquivo de outro projeto", () => {
    for (const referencia of referenciasLocais(html)) {
        assert.ok(!referencia.startsWith("../"), `o cloneYou nao deve sair da propria pasta: ${referencia}`);
    }
});

test("o HTML declara idioma, codificacao, viewport e descricao", () => {
    assert.match(html, /<html lang="pt-BR">/);
    assert.match(html, /<meta charset="UTF-8">/i);
    assert.match(html, /name="viewport"/);
    assert.match(html, /name="description"/);
});

test("os elementos que o JavaScript procura existem no HTML", () => {
    const script = fs.readFileSync(path.join(raiz, "js", "script.js"), "utf8");
    const ids = [...script.matchAll(/querySelector\("#([\w-]+)"\)/g)].map((m) => m[1]);

    assert.ok(ids.length > 0, "nenhum id lido do script");
    for (const id of new Set(ids)) {
        assert.ok(html.includes(`id="${id}"`), `o script procura #${id}, que nao existe no HTML`);
    }
});

test("[hidden] esta protegido no CSS", () => {
    // .videos-grid usa display:grid e .modal usa display:flex. Sem esta regra,
    // o atributo hidden nao esconderia nenhum dos dois.
    const css = fs.readFileSync(path.join(raiz, "css", "style.css"), "utf8");
    assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
});

test("todo botao so de icone tem aria-label", () => {
    const botoes = html.match(/<button[^>]*>[\s\S]*?<\/button>/g) || [];
    for (const botao of botoes) {
        const texto = botao.replace(/<[^>]+>/g, "").trim();
        if (texto) continue;
        assert.match(botao, /aria-label="/, `botao sem texto e sem aria-label: ${botao.slice(0, 90)}`);
    }
});
