// Teste funcional do estacao-pc no Chromium, com a rede bloqueada.
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
    const pedidosExternos = [];
    aba.on("pageerror", (erro) => errosDeJs.push(erro.message));
    await aba.route("**/*", (rota) => {
        const url = rota.request().url();
        if (new URL(url).protocol === "file:") return rota.continue();
        pedidosExternos.push(url);
        return rota.abort();
    });
    await aba.goto(pagina, { waitUntil: "domcontentloaded" });
    await aba.waitForSelector(".part");
    return { aba, errosDeJs, pedidosExternos };
}

const pecas = (aba) => aba.locator(".part__name").allTextContents();

test("o perfil Essencial abre por padrao com as suas quatro pecas", pular, async (t) => {
    const { aba } = await abrir(t);
    assert.match(await aba.locator(".build-panel__code").textContent(), /ESSENCIAL/);
    assert.deepEqual(await pecas(aba), ["Ryzen 5 / Core i5", "16 GB DDR4", "SSD NVMe 500 GB", "Fonte 500 W"]);
});

test("trocar de perfil troca codigo, titulo, descricao e pecas", pular, async (t) => {
    const { aba } = await abrir(t);

    await aba.click('.build-tab[data-build="criador"]');
    assert.match(await aba.locator(".build-panel__code").textContent(), /CRIADOR/);
    assert.deepEqual(await pecas(aba), ["Ryzen 7 / Core i7", "32 GB DDR5", "SSD NVMe 1 TB", "Fonte 650 W"]);

    await aba.click('.build-tab[data-build="jogador"]');
    assert.match(await aba.locator(".build-panel__code").textContent(), /JOGADOR/);
    assert.ok((await pecas(aba)).includes("GPU dedicada 12 GB"));
});

test("a numeracao das pecas comeca em 01", pular, async (t) => {
    const { aba } = await abrir(t);
    assert.deepEqual(await aba.locator(".part__index").allTextContents(), ["01", "02", "03", "04"]);
});

// Regressao do defeito D2 da auditoria.
test("so um perfil fica marcado, e o estado chega a quem usa leitor de tela", pular, async (t) => {
    const { aba } = await abrir(t);
    const estados = () =>
        aba.locator(".build-tab").evaluateAll((bs) => bs.map((b) => b.getAttribute("aria-pressed")));

    assert.deepEqual(await estados(), ["true", "false", "false"]);
    await aba.click('.build-tab[data-build="criador"]');
    assert.deepEqual(await estados(), ["false", "true", "false"]);
    assert.equal(await aba.locator(".build-tab.is-active").count(), 1);
});

// Regressao do defeito D1 da auditoria.
test("no celular, clicar num link do menu fecha o menu", pular, async (t) => {
    const { aba } = await abrir(t, 390, 844);

    await aba.click("#menu-toggle");
    assert.equal(await aba.locator("#main-nav").isVisible(), true, "o menu devia abrir");

    await aba.click('#main-nav a[href="#componentes"]');
    assert.equal(await aba.locator("#main-nav").isVisible(), false, "o menu devia fechar");
    assert.equal(await aba.locator("#menu-toggle").getAttribute("aria-expanded"), "false");
});

// Regressao do defeito D3 da auditoria.
test("a fonte e pedida uma vez so", pular, async (t) => {
    const { pedidosExternos } = await abrir(t);
    const fontes = pedidosExternos.filter((url) => url.includes("fonts.googleapis.com/css2"));
    assert.equal(fontes.length, 1, `esperava 1 pedido de fonte, sairam ${fontes.length}`);
});

test("o botao Salvar perfil mostra o aviso", pular, async (t) => {
    const { aba } = await abrir(t);
    await aba.click('button[data-toast]');
    assert.equal(await aba.locator("#toast").evaluate((el) => el.classList.contains("is-visible")), true);
    assert.match(await aba.locator("#toast").textContent(), /Perfil salvo/);
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
    await aba.click('.build-tab[data-build="jogador"]');
    assert.deepEqual(errosDeJs, []);
});
