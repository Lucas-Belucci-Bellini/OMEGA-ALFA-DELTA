// Teste funcional do wiki-modern-warfare no Chromium, com a rede bloqueada.
// O Playwright nao e dependencia do projeto: sem ele, os testes sao pulados.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

let chromium = null;
try {
    ({ chromium } = require("playwright"));
} catch {
    try {
        ({ chromium } = require("/opt/node22/lib/node_modules/playwright"));
    } catch {
        chromium = null;
    }
}

const pagina = "file://" + path.resolve(__dirname, "..", "index.html");
const pular = { skip: chromium ? false : "playwright nao instalado" };

async function abrir(t, largura = 1280, altura = 900) {
    const navegador = await chromium.launch();
    t.after(() => navegador.close());
    const aba = await navegador.newPage({ viewport: { width: largura, height: altura } });
    const errosDeJs = [];
    aba.on("pageerror", (erro) => errosDeJs.push(erro.message));
    await aba.route("**/*", (rota) =>
        new URL(rota.request().url()).protocol === "file:" ? rota.continue() : rota.abort()
    );
    await aba.goto(pagina, { waitUntil: "domcontentloaded" });
    await aba.waitForSelector(".timeline-card");
    return { aba, errosDeJs };
}

const visiveis = (aba) => aba.locator(".timeline-card:visible").count();

test("a linha do tempo mostra os quatro capitulos", pular, async (t) => {
    const { aba } = await abrir(t);
    assert.equal(await visiveis(aba), 4);
});

test("os filtros mostram e escondem os cartoes certos", pular, async (t) => {
    const { aba } = await abrir(t);

    await aba.click('.filter[data-filter="campanha"]');
    assert.equal(await visiveis(aba), 3, "o filtro Campanhas devia deixar 3");

    await aba.click('.filter[data-filter="personagens"]');
    assert.equal(await visiveis(aba), 1, "o filtro Personagens devia deixar 1");

    await aba.click('.filter[data-filter="all"]');
    assert.equal(await visiveis(aba), 4, "Tudo devia trazer os 4 de volta");
});

test("so um filtro fica marcado como ativo por vez", pular, async (t) => {
    const { aba } = await abrir(t);
    await aba.click('.filter[data-filter="campanha"]');
    assert.equal(await aba.locator(".filter.is-active").count(), 1);
    assert.equal(
        await aba.locator(".filter.is-active").getAttribute("data-filter"),
        "campanha"
    );
});

// Regressao do defeito D1 da auditoria.
test("no celular, clicar num link do menu fecha o menu", pular, async (t) => {
    const { aba } = await abrir(t, 390, 844);

    await aba.click("#menu-toggle");
    assert.equal(await aba.locator(".topbar__nav").isVisible(), true, "o menu devia abrir");
    assert.equal(await aba.locator("#menu-toggle").getAttribute("aria-expanded"), "true");

    await aba.click('.topbar__nav a[href="#timeline"]');
    assert.equal(
        await aba.locator(".topbar__nav").isVisible(),
        false,
        "o menu devia fechar ao escolher uma secao"
    );
    assert.equal(await aba.locator("#menu-toggle").getAttribute("aria-expanded"), "false");
});

test("a grade mantem 4 colunas no desktop e reduz nas telas menores", pular, async (t) => {
    const colunas = async (aba) =>
        aba.locator("#timeline-list").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);

    for (const [largura, esperado] of [[1440, 4], [1280, 4], [820, 2], [390, 1]]) {
        const { aba } = await abrir(t, largura, 900);
        assert.equal(await colunas(aba), esperado, `em ${largura}px esperava ${esperado} colunas`);
    }
});

test("nao ha rolagem horizontal no celular, no tablet nem no desktop", pular, async (t) => {
    for (const [largura, altura] of [[390, 844], [820, 1180], [1440, 900]]) {
        const { aba } = await abrir(t, largura, altura);
        const excesso = await aba.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        assert.ok(excesso <= 1, `rolagem horizontal de ${excesso}px em ${largura}x${altura}`);
    }
});

test("a pagina abre sem erro de JavaScript, mesmo sem internet", pular, async (t) => {
    const { aba, errosDeJs } = await abrir(t);
    await aba.click('.filter[data-filter="campanha"]');
    await aba.click('.filter[data-filter="all"]');
    assert.deepEqual(errosDeJs, []);
});
