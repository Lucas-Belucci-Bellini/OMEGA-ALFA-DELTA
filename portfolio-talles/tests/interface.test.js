// Teste funcional do portfolio-talles no Chromium, com a rede bloqueada.
// O Playwright nao e dependencia do projeto: sem ele, os testes sao pulados.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");

function carregarPlaywright() {
    try {
        return require("playwright"); // instalado dentro do projeto
    } catch {
        // segue adiante: pode estar instalado globalmente
    }

    try {
        // require() nao procura na pasta global do npm, entao perguntamos onde ela fica.
        const { execSync } = require("node:child_process");
        const path = require("node:path");
        const raizGlobal = execSync("npm root -g", {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "ignore"]
        }).trim();
        return require(path.join(raizGlobal, "playwright"));
    } catch {
        return null; // nao esta instalado: os testes deste arquivo sao pulados
    }
}

const { chromium } = carregarPlaywright() || {};

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
    await aba.waitForSelector(".favorite-card");
    return { aba, errosDeJs };
}

test("a pagina mostra as duas listas de favoritos", pular, async (t) => {
    const { aba } = await abrir(t);
    assert.equal(await aba.locator(".favorite-card").count(), 2);
});

test("o botao de cada cartao mostra o aviso correspondente", pular, async (t) => {
    const { aba } = await abrir(t);

    await aba.click(".favorite-card--anime .circle-button");
    assert.match(await aba.locator("#toast").textContent(), /animes/);
    assert.equal(await aba.locator("#toast").evaluate((el) => el.classList.contains("is-visible")), true);

    await aba.click(".favorite-card--games .circle-button");
    assert.match(await aba.locator("#toast").textContent(), /jogos/);
});

// Regressao do defeito D2 da auditoria.
test("os botoes dos cartoes tem nome acessivel", pular, async (t) => {
    const { aba } = await abrir(t);

    const nomes = await aba.locator(".circle-button").evaluateAll((botoes) =>
        botoes.map((b) => b.getAttribute("aria-label"))
    );
    assert.equal(nomes.length, 2);
    for (const nome of nomes) {
        assert.ok(nome && nome.trim().length > 3, `botao sem nome util: ${JSON.stringify(nome)}`);
    }
});

// Regressao do defeito D1 da auditoria.
test("no celular, clicar num link do menu fecha o menu", pular, async (t) => {
    const { aba } = await abrir(t, 390, 844);

    await aba.click("#menu-toggle");
    assert.equal(await aba.locator("#main-nav").isVisible(), true, "o menu devia abrir");

    await aba.click('#main-nav a[href="#sobre"]');
    assert.equal(await aba.locator("#main-nav").isVisible(), false, "o menu devia fechar");
    assert.equal(await aba.locator("#menu-toggle").getAttribute("aria-expanded"), "false");
});

test("as ancoras do menu levam as secoes que existem", pular, async (t) => {
    const { aba } = await abrir(t);
    for (const secao of ["sobre", "favoritos", "recomendacoes"]) {
        assert.equal(await aba.locator(`#${secao}`).count(), 1, `secao #${secao} nao encontrada`);
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
    await aba.click(".favorite-card--anime .circle-button");
    assert.deepEqual(errosDeJs, []);
});
