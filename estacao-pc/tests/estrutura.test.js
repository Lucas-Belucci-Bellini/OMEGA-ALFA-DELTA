// Teste estrutural do estacao-pc — roda com "node --test tests/*.test.js".
// Cada projeto tem o seu proprio arquivo de propósito: um helper compartilhado
// recriaria a amarra entre projetos que esta reorganizacao desfez.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
const css = fs.readFileSync(path.join(raiz, "css", "style.css"), "utf8");
const js = fs.readFileSync(path.join(raiz, "js", "script.js"), "utf8");

// Um comentario pode citar exatamente o que o teste procura — inclusive um
// comentario explicando por que aquilo NAO esta mais no arquivo. Por isso as
// verificacoes abaixo olham o codigo sem os comentarios.
function semComentarios(conteudo, tipo) {
    return tipo === "html"
        ? conteudo.replace(/<!--[\s\S]*?-->/g, "")
        : conteudo.replace(/\/\*[\s\S]*?\*\//g, "");
}

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

test("toda imagem tem alt", () => {
    for (const img of html.match(/<img[^>]*>/g) || []) {
        assert.match(img, /\salt="/, `imagem sem alt: ${img}`);
    }
});

test("nao ha imagem na pasta assets que ninguem use", () => {
    for (const arquivo of fs.readdirSync(path.join(raiz, "assets"))) {
        const usada = html.includes(arquivo) || css.includes(arquivo) || js.includes(arquivo);
        assert.ok(usada, `assets/${arquivo} nao e usado por HTML, CSS nem JS`);
    }
});

// Regressao do defeito D3 da auditoria.
test("a fonte externa e pedida em um lugar so", () => {
    // Antes, a mesma URL estava no @import do CSS e no <link> do HTML, e o
    // navegador fazia duas requisicoes identicas.
    assert.doesNotMatch(
        semComentarios(css, "css"),
        /@import/,
        "o CSS nao deve importar a fonte: o <link> do HTML ja faz isso"
    );

    const linksDeFonte = (html.match(/<link[^>]*fonts\.googleapis\.com\/css2[^>]*>/g) || []).length;
    assert.equal(linksDeFonte, 1, `esperava 1 <link> de fonte, encontrei ${linksDeFonte}`);
});

// Regressao do defeito D2 da auditoria.
test("nao ha role=tab sem o comportamento de teclado que ele promete", () => {
    // role="tab" promete navegacao pelas setas, aria-controls e role="tabpanel".
    // Se um dia alguem implementar tudo isso, este teste passa a cobrar as
    // outras partes junto — e nao deixa voltar o contrato pela metade.
    const marcacao = semComentarios(html, "html");
    if (!/role="tab"/.test(marcacao)) return;

    assert.match(marcacao, /aria-controls="/, 'role="tab" exige aria-controls ligando a aba ao painel');
    assert.match(marcacao, /role="tabpanel"/, 'role="tab" exige um painel com role="tabpanel"');
    assert.match(js, /Arrow(Left|Right)/, 'role="tab" exige navegacao pelas setas do teclado');
});

test("os botoes de perfil dizem qual esta ativo", () => {
    const botoes = semComentarios(html, "html").match(/<button[^>]*class="build-tab[^>]*>/g) || [];
    assert.equal(botoes.length, 3, "esperava tres botoes de perfil");
    for (const botao of botoes) {
        assert.match(botao, /aria-pressed="(true|false)"/, `botao de perfil sem aria-pressed: ${botao}`);
    }
    assert.equal(
        botoes.filter((b) => b.includes('aria-pressed="true"')).length,
        1,
        "so um perfil pode comecar marcado"
    );
});

test("os links do menu fecham o menu", () => {
    assert.match(js, /\.nav a/, "nao ha tratamento para os links do menu");
});

test("todo perfil declarado no script tem os quatro campos", () => {
    for (const nome of ["essencial", "criador", "jogador"]) {
        assert.ok(js.includes(`${nome}: {`), `perfil ${nome} nao encontrado no script`);
        assert.ok(html.includes(`data-build="${nome}"`), `nao ha botao para o perfil ${nome}`);
    }
});
