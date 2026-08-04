#!/usr/bin/env python3
"""
Verificador dos circuitos gerados por `gerar_circuitos.py`.

Le os arquivos JSON exatamente como o Digital Logic Sim leria, simula cada
chip resolvendo tudo recursivamente ate a porta NAND embutida, e compara o
resultado com a tabela-verdade esperada.

Nao confia em nenhuma logica do gerador: a simulacao parte apenas dos
arquivos gravados em disco.

Uso:
    python3 verificar_circuitos.py [pasta_do_projeto]
"""

from __future__ import annotations

import itertools
import json
import os
import sys

BUILTIN = {
    "NAND":   {"in": [0, 1],                    "out": [2]},
    "4-1BIT": {"in": [0],                       "out": [1, 2, 3, 4]},
    "1-4BIT": {"in": [0, 1, 2, 3],              "out": [4]},
    "8-1BIT": {"in": [0],                       "out": [1, 2, 3, 4, 5, 6, 7, 8]},
    "1-8BIT": {"in": [0, 1, 2, 3, 4, 5, 6, 7],  "out": [8]},
}

CHIPS: dict[str, dict] = {}


def load(project_dir):
    chips_dir = os.path.join(project_dir, "Chips")
    for fn in os.listdir(chips_dir):
        if not fn.endswith(".json"):
            continue
        with open(os.path.join(chips_dir, fn), encoding="utf-8") as f:
            d = json.load(f)
        CHIPS[d["Name"]] = d


def pin_ids(name):
    if name in BUILTIN:
        return BUILTIN[name]
    d = CHIPS[name]
    return {"in": [p["ID"] for p in d["InputPins"]],
            "out": [p["ID"] for p in d["OutputPins"]]}


def compute_builtin(name, ins):
    if name == "NAND":
        return [1 - (ins[0] & ins[1])]
    if name == "8-1BIT":
        v = ins[0]
        return [(v >> (7 - i)) & 1 for i in range(8)]
    if name == "1-8BIT":
        v = 0
        for i, b in enumerate(ins):
            v |= (b & 1) << (7 - i)
        return [v]
    if name == "4-1BIT":
        v = ins[0]
        return [(v >> (3 - i)) & 1 for i in range(4)]
    if name == "1-4BIT":
        v = 0
        for i, b in enumerate(ins):
            v |= (b & 1) << (3 - i)
        return [v]
    raise KeyError(name)


def simulate(name, inputs):
    """Simula um chip customizado. `inputs` na ordem de InputPins."""
    d = CHIPS[name]
    subs = {s["ID"]: s for s in d["SubChips"]}

    # alvo -> fonte
    driver = {}
    for w in d["Wires"]:
        s = (w["SourcePinAddress"]["PinOwnerID"], w["SourcePinAddress"]["PinID"])
        t = (w["TargetPinAddress"]["PinOwnerID"], w["TargetPinAddress"]["PinID"])
        driver[t] = s

    val = {}
    for p, v in zip(d["InputPins"], inputs):
        val[(p["ID"], 0)] = v

    done, stack = set(), set()

    def source_value(key):
        if key in val:
            return val[key]
        owner, _pin = key
        if owner in subs:
            eval_sub(owner)
            return val.get(key, 0)
        return 0                      # nao conectado = nivel baixo

    def pin_input(key):
        if key in driver:
            return source_value(driver[key])
        return 0                      # entrada solta = 0

    def eval_sub(sid):
        if sid in done:
            return
        if sid in stack:
            raise RuntimeError(f"ciclo combinacional em {name} (sub-chip {sid})")
        stack.add(sid)
        s = subs[sid]
        nm = s["Name"]
        pins = pin_ids(nm)
        ivals = [pin_input((sid, pid)) for pid in pins["in"]]
        ovals = (compute_builtin(nm, ivals) if nm in BUILTIN
                 else simulate(nm, ivals))
        for pid, v in zip(pins["out"], ovals):
            val[(sid, pid)] = v
        stack.discard(sid)
        done.add(sid)

    return [pin_input((p["ID"], 0)) for p in d["OutputPins"]]


# ==========================================================================
# Tabelas-verdade esperadas
# ==========================================================================
def bits_for(name):
    """Numero de bits de cada pino de entrada do chip."""
    return [p["BitCount"] for p in CHIPS[name]["InputPins"]]


GATE1 = {
    "NOT":  lambda a: [1 - a],
    "AND":  lambda a, b: [a & b],
    "OR":   lambda a, b: [a | b],
    "NOR":  lambda a, b: [1 - (a | b)],
    "XOR":  lambda a, b: [a ^ b],
    "XNOR": lambda a, b: [1 - (a ^ b)],
}

BANK_OP = {
    "NOT":  lambda m, a: [~a & m],
    "AND":  lambda m, a, b: [a & b],
    "NAND": lambda m, a, b: [~(a & b) & m],
    "OR":   lambda m, a, b: [a | b],
    "NOR":  lambda m, a, b: [~(a | b) & m],
    "XOR":  lambda m, a, b: [a ^ b],
    "XNOR": lambda m, a, b: [~(a ^ b) & m],
}

GATE3 = {
    "AND-3":  lambda a, b, c: [a & b & c],
    "OR-3":   lambda a, b, c: [a | b | c],
    "NAND-3": lambda a, b, c: [1 - (a & b & c)],
    "NOR-3":  lambda a, b, c: [1 - (a | b | c)],
}

# Somadores: a saida e [S, Cout].
ARITH1 = {
    "HALF-ADDER": lambda a, b: [a ^ b, a & b],
    "FULL-ADDER": lambda a, b, ci: [a ^ b ^ ci, 1 if (a + b + ci) >= 2 else 0],
}

SELECT1 = {
    # SEL=0 -> A, SEL=1 -> B
    "MUX-2": lambda a, b, s: [b if s else a],
    "DEC-2": lambda s1, s0: [1 if k == (s1 << 1 | s0) else 0 for k in range(4)],
    "DEC-3": lambda s2, s1, s0: [1 if k == (s2 << 2 | s1 << 1 | s0) else 0
                                 for k in range(8)],
}

ACTIVITY = {
    "Q1-IDENTIDADES":    lambda a, b, c, d, e, f: [a, 1, c, d, 0, f],
    "Q2-ASSOCIATIVA-OU": lambda a, b, c: [a | b | c, a | b | c],
    "Q2-ASSOCIATIVA-E":  lambda a, b, c: [a & b & c, a & b & c],
    "Q3-DISTRIBUTIVA":   lambda a, b, c: [a & (b | c), a & (b | c)],
    "Q3-FATORACAO":      lambda m, n: [n, n],
    "Q4-1":              lambda a, b: [a, a],
    "Q4-2":              lambda a, b, c: [1, 1],
    "Q4-3":              lambda a, b, c: [a, a],
    "Q4-4":              lambda a, b, c: [a | b, a | b],
    "Q4-5":              lambda a, b, c: [a | (b & c), a | (b & c)],
    "Q5-ORIGINAL":       lambda a, b, c: [b & c],
    "Q5-SIMPLIFICADO":   lambda b, c: [b & c],
    "Q5-COMPARACAO":     lambda a, b, c: [b & c, b & c],
}

failures: list[str] = []
checked = 0


def check(name, expected_fn, cases):
    global checked
    bad = 0
    for case in cases:
        got = simulate(name, list(case))
        exp = list(expected_fn(*case))
        checked += 1
        if got != exp:
            bad += 1
            if bad <= 3:
                failures.append(f"  {name}{tuple(case)}: obtido {got}, esperado {exp}")
    status = "FALHOU" if bad else "ok"
    print(f"  {name:<20} {len(cases):>4} casos  ... {status}")
    if bad:
        failures.append(f"  -> {name}: {bad}/{len(cases)} casos incorretos")
    return bad == 0


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    project = sys.argv[1] if len(sys.argv) > 1 else os.path.join(
        here, "Projects", "ALGEBRA-BOOLEANA")
    load(project)
    print(f"Chips carregados: {len(CHIPS)}\n")

    print("Constantes:")
    check("CONST-1", lambda: [1], [()])
    check("CONST-0", lambda: [0], [()])

    print("\nPortas basicas de 1 bit (exaustivo):")
    for g, fn in GATE1.items():
        n = len(CHIPS[g]["InputPins"])
        check(g, fn, list(itertools.product([0, 1], repeat=n)))

    for bits in (4, 8):
        mask = (1 << bits) - 1
        # 4 bits: exaustivo. 8 bits: amostragem determinista ampla.
        if bits == 4:
            vals = list(range(16))
        else:
            vals = [0, 1, 2, 5, 15, 16, 42, 85, 128, 170, 200, 254, 255]
        print(f"\nPortas basicas de {bits} bits:")
        for g, op in BANK_OP.items():
            name = f"{g}-{bits}"
            if g == "NOT":
                cases = [(v,) for v in vals]
            else:
                cases = [(x, y) for x in vals for y in vals]
            check(name, (lambda o: (lambda *a: o(mask, *a)))(op), cases)

    print("\nPortas de 3 entradas (exaustivo):")
    for g, fn in GATE3.items():
        check(g, fn, list(itertools.product([0, 1], repeat=3)))

    print("\nAritmetica:")
    for g, fn in ARITH1.items():
        n = len(CHIPS[g]["InputPins"])
        check(g, fn, list(itertools.product([0, 1], repeat=n)))

    for bits in (4, 8):
        mask = (1 << bits) - 1
        # Somador de 4 bits: exaustivo com carry. 8 bits: amostragem ampla,
        # incluindo os casos de estouro.
        if bits == 4:
            vals = list(range(16))
        else:
            vals = [0, 1, 2, 5, 15, 16, 42, 85, 128, 170, 200, 254, 255]
        cases = [(x, y, ci) for x in vals for y in vals for ci in (0, 1)]

        def adder(x, y, ci, m=mask, w=bits):
            t = x + y + ci
            return [t & m, 1 if t > m else 0]

        check(f"ADDER-{bits}", adder, cases)

    print("\nSelecao e decodificacao (exaustivo):")
    for g, fn in SELECT1.items():
        n = len(CHIPS[g]["InputPins"])
        check(g, fn, list(itertools.product([0, 1], repeat=n)))

    for bits in (4, 8):
        vals = list(range(16)) if bits == 4 else [0, 1, 42, 85, 128, 170, 255]
        check(f"MUX-2-{bits}", lambda x, y, s: [y if s else x],
              [(x, y, s) for x in vals for y in vals for s in (0, 1)])
        check(f"EQUALS-{bits}", lambda x, y: [1 if x == y else 0],
              [(x, y) for x in vals for y in vals])

    print("\nCircuitos da atividade (exaustivo):")
    for name, fn in ACTIVITY.items():
        n = len(CHIPS[name]["InputPins"])
        check(name, fn, list(itertools.product([0, 1], repeat=n)))

    print("\n" + "=" * 60)
    if failures:
        print(f"FALHAS ({checked} casos testados):")
        for f in failures:
            print(f)
        return 1
    print(f"TODOS OS CIRCUITOS CORRETOS - {checked} casos de teste, "
          f"{len(CHIPS)} chips, tudo reduzido a NAND.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
