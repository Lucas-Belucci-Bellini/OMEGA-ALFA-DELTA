// Teste funcional do cloneYou em um navegador de verdade (Chromium/Playwright).
//
// O Playwright NAO e dependencia do projeto: se ele nao estiver instalado, os
// testes sao pulados em vez de falharem. Para rodar de verdade:
//     npm install -g playwright && npx playwright install chromium
//
// Rede: os pedidos externos (miniaturas, icones, fonte) sao bloqueados de
// proposito. Assim o teste roda offline e ainda comprova que a pagina funciona
// sem internet — que e como muitos alunos vao abri-la.
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
    // Fecha o navegador mesmo quando a asserção falha; sem isto, uma falha
    // deixaria o processo do Chromium vivo e o runner ficaria esperando.
    t.after(() => navegador.close());
    const aba = await navegador.newPage({ viewport: { width: largura, height: altura } });
    const errosDeJs = [];
    aba.on("pageerror", (erro) => errosDeJs.push(erro.message));
    await aba.route("**/*", (rota) =>
        new URL(rota.request().url()).protocol === "file:" ? rota.continue() : rota.abort()
    );
    await aba.goto(pagina, { waitUntil: "domcontentloaded" });
    await aba.waitForSelector(".video-card");
    return { aba, errosDeJs };
}

test("a grade renderiza os 12 videos do catalogo", pular, async (t) => {
    const { aba } = await abrir(t);
    assert.equal(await aba.locator(".video-card").count(), 12);
    assert.equal((await aba.locator("#results-count").textContent()).trim(), "12 vídeos");
});

test("busca sem resultado mostra o estado vazio e esconde a grade", pular, async (t) => {
    const { aba } = await abrir(t);
    await aba.fill("#search-input", "termo-que-nao-existe");
    await aba.press("#search-input", "Enter");
    assert.equal(await aba.locator("#empty-state").isVisible(), true);
    assert.equal(await aba.locator("#videos-grid").isVisible(), false);

    await aba.click("#clear-search");
    assert.equal(await aba.locator(".video-card").count(), 12);
});

test("os filtros por categoria reduzem a lista", pular, async (t) => {
    const { aba } = await abrir(t);
    await aba.click('.chip[data-filter="Jogos"]');
    const comFiltro = await aba.locator(".video-card").count();
    assert.ok(comFiltro > 0 && comFiltro < 12, `esperado entre 1 e 11 cards, veio ${comFiltro}`);
});

// Regressao do defeito D1 da auditoria.
test("o botao 'Mais opcoes' responde ao teclado sem abrir o modal", pular, async (t) => {
    const { aba } = await abrir(t);
    await aba.locator(".video-card").first().locator(".video-card__menu").focus();
    await aba.keyboard.press("Enter");

    assert.equal(await aba.locator("#video-modal").isVisible(), false, "o modal nao devia abrir");
    assert.equal(
        await aba.locator("#toast").evaluate((el) => el.classList.contains("is-visible")),
        true,
        "o aviso do botao devia aparecer"
    );
});

// Regressao do defeito D2 da auditoria.
test("abrir o modal leva o foco para dentro dele e devolve ao fechar", pular, async (t) => {
    const { aba } = await abrir(t);
    await aba.locator(".video-card").first().focus();
    await aba.keyboard.press("Enter");

    assert.equal(await aba.locator("#video-modal").isVisible(), true);
    assert.equal(
        await aba.evaluate(() => Boolean(document.activeElement.closest("#video-modal"))),
        true,
        "o foco devia estar dentro do modal"
    );

    await aba.keyboard.press("Escape");
    assert.equal(await aba.locator("#video-modal").isVisible(), false);
    assert.equal(
        await aba.evaluate(() => document.activeElement.classList.contains("video-card")),
        true,
        "o foco devia voltar para o card que abriu o modal"
    );
});

test("o tema escuro liga, desliga e fica salvo", pular, async (t) => {
    const { aba } = await abrir(t);
    await aba.click("#theme-toggle");
    assert.equal(await aba.evaluate(() => document.documentElement.dataset.theme), "dark");

    await aba.reload({ waitUntil: "domcontentloaded" });
    await aba.waitForSelector(".video-card");
    assert.equal(
        await aba.evaluate(() => document.documentElement.dataset.theme),
        "dark",
        "a escolha devia sobreviver ao recarregamento (localStorage)"
    );
});

test("nao ha rolagem horizontal no celular, no tablet nem no desktop", pular, async (t) => {
    for (const [largura, altura] of [[390, 844], [820, 1180], [1440, 900]]) {
        const { aba } = await abrir(t, largura, altura);
        const temOverflow = await aba.evaluate(
            () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        );
        assert.equal(temOverflow, false, `rolagem horizontal em ${largura}x${altura}`);
    }
});

test("a pagina abre sem erro de JavaScript, mesmo sem internet", pular, async (t) => {
    const { aba, errosDeJs } = await abrir(t);
    await aba.click(".video-card");
    await aba.keyboard.press("Escape");
    await aba.click("#menu-toggle");
    assert.deepEqual(errosDeJs, []);
});
