// Teste de isolamento do repositorio inteiro.
//
// A regra que este arquivo protege: cada projeto tem que abrir sozinho. Nenhum
// deles pode carregar CSS, JS ou imagem de dentro de outro. E nenhum caminho
// local pode apontar para um arquivo que nao existe.
//
// Roda com: node --test tests/*.test.js   (a partir da raiz do repositorio)
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const raiz = path.resolve(__dirname, "..");

// Projetos ativos: precisam abrir sozinhos e sem referencia quebrada.
const PROJETOS_ATIVOS = ["cloneYou", "wiki-modern-warfare", "portfolio-talles", "estacao-pc"];

// Diretorios originais: preservados como historico de aprendizagem. Varios tem
// referencia quebrada de proposito — e assim que foram entregues. Aqui so se
// exige que continuem isolados, nunca que estejam certos.
const ORIGINAIS = [
    "ALFA",
    "site_DuDuzinVideoJogus_01",
    "site_pedrocamposcoimbra8-afk_01",
    "site_felipebrayan1403-cell_01",
    "site_ajuda_pensamento_01"
];

function listarHtml(pasta) {
    const encontrados = [];
    (function percorrer(atual) {
        for (const item of fs.readdirSync(atual, { withFileTypes: true })) {
            const completo = path.join(atual, item.name);
            if (item.isDirectory()) {
                if (item.name === "node_modules" || item.name === "apidocs") continue;
                percorrer(completo);
            } else if (item.name.endsWith(".html")) {
                encontrados.push(completo);
            }
        }
    })(path.join(raiz, pasta));
    return encontrados;
}

function referenciasLocais(arquivo) {
    const conteudo = fs.readFileSync(arquivo, "utf8");
    const brutas = conteudo.match(/(?:href|src)="([^"]+)"/g) || [];
    return brutas
        .map((item) => item.replace(/^(?:href|src)="/, "").replace(/"$/, ""))
        .filter((valor) => !/^(https?:|\/\/|#|mailto:|javascript:|data:)/.test(valor));
}

for (const projeto of [...PROJETOS_ATIVOS, ...ORIGINAIS]) {
    test(`${projeto} nao usa arquivo de outro projeto`, () => {
        const limite = path.join(raiz, projeto);

        for (const arquivo of listarHtml(projeto)) {
            for (const referencia of referenciasLocais(arquivo)) {
                const alvo = path.resolve(path.dirname(arquivo), referencia.split(/[?#]/)[0]);
                const dentro = alvo === limite || alvo.startsWith(limite + path.sep);
                assert.ok(
                    dentro,
                    `${path.relative(raiz, arquivo)} aponta para fora de ${projeto}: ${referencia}`
                );
            }
        }
    });
}

for (const projeto of PROJETOS_ATIVOS) {
    test(`${projeto} abre sozinho, sem referencia quebrada`, () => {
        const arquivos = listarHtml(projeto);
        assert.ok(arquivos.length > 0, `${projeto} nao tem nenhum index.html`);
        assert.ok(
            fs.existsSync(path.join(raiz, projeto, "index.html")),
            `${projeto} precisa de um index.html na raiz da pasta`
        );

        for (const arquivo of arquivos) {
            for (const referencia of referenciasLocais(arquivo)) {
                const alvo = path.resolve(path.dirname(arquivo), referencia.split(/[?#]/)[0]);
                assert.ok(
                    fs.existsSync(alvo),
                    `${path.relative(raiz, arquivo)} pede um arquivo que nao existe: ${referencia}`
                );
            }
        }
    });

    test(`${projeto} tem README proprio`, () => {
        assert.ok(fs.existsSync(path.join(raiz, projeto, "README.md")));
    });
}
