#!/usr/bin/env python3
"""
Gerador dos circuitos da Atividade de Algebra Booleana para o
Digital Logic Sim - Unifil (https://github.com/Eronponce/Digital-Logic-Sim-Unifil).

Constroi, do zero e apenas a partir da porta NAND embutida:

  * portas basicas de 1 bit  : NOT, AND, OR, NOR, XOR, XNOR
  * portas basicas de 4 bits : NOT-4, AND-4, NAND-4, OR-4, NOR-4, XOR-4, XNOR-4
  * portas basicas de 8 bits : NOT-8, AND-8, NAND-8, OR-8, NOR-8, XOR-8, XNOR-8
  * circuitos das 5 questoes da atividade (original x simplificado)

O formato JSON segue exatamente `Assets/Scripts/Description/Types/ChipDescription.cs`
do repositorio acima (DLS 2.3.0).

Uso:
    python3 gerar_circuitos.py [destino]

Sem argumento, gera em `Projects/ALGEBRA-BOOLEANA` ao lado deste arquivo.
"""

from __future__ import annotations

import json
import os
import sys
import zlib
from datetime import datetime, timedelta, timezone

DLS_VERSION = "2.3.0"
PROJECT_NAME = "ALGEBRA-BOOLEANA"

# Grade do editor (DrawSettings.GridSize = 0.125). Todas as posicoes sao
# multiplos dela para os chips cairem certinho no snap do editor.
GRID = 0.125


# --------------------------------------------------------------------------
# Chips embutidos (BuiltinChipCreator.cs / ChipTypeHelper.cs)
#
# Os IDs dos pinos de um chip embutido sao indices sequenciais: primeiro as
# entradas (0..n-1), depois as saidas (n..n+m-1).
# Para chips customizados, o ID do pino e o ID declarado no proprio arquivo
# do chip -- por isso o registro `CHIPS` abaixo guarda esses IDs.
# --------------------------------------------------------------------------
BUILTIN = {
    "NAND":   {"in": [0, 1],                    "out": [2]},          # IN B, IN A -> OUT
    "4-1BIT": {"in": [0],                       "out": [1, 2, 3, 4]},  # split 4 -> 1
    "1-4BIT": {"in": [0, 1, 2, 3],              "out": [4]},           # merge 1 -> 4
    "8-1BIT": {"in": [0],                       "out": [1, 2, 3, 4, 5, 6, 7, 8]},
    "1-8BIT": {"in": [0, 1, 2, 3, 4, 5, 6, 7],  "out": [8]},
}

# Registro de tudo que ja foi gerado: nome -> descricao do chip (dict JSON).
CHIPS: dict[str, dict] = {}
ORDER: list[str] = []          # ordem de criacao (dependencias primeiro)


def rgb(r, g, b):
    return {"r": r, "g": g, "b": b, "a": 1}


COL = {
    "not":   rgb(0.617, 0.148, 0.102),
    "and":   rgb(0.244, 0.571, 0.680),
    "or":    rgb(0.298, 0.247, 0.600),
    "nor":   rgb(0.196, 0.400, 0.353),
    "xor":   rgb(0.683, 0.347, 0.736),
    "xnor":  rgb(0.478, 0.290, 0.639),
    "nand":  rgb(0.730, 0.260, 0.260),
    "const": rgb(0.400, 0.400, 0.420),
    "quest": rgb(0.850, 0.560, 0.130),
    "simpl": rgb(0.180, 0.600, 0.290),
}


class Chip:
    """Builder de um chip. Gera IDs deterministicos para nao colidir."""

    def __init__(self, name, colour, size=(0.7, 0.5), name_location=0):
        self.name = name
        self.colour = colour
        self.size = size
        self.name_location = name_location
        self.inputs: list[dict] = []
        self.outputs: list[dict] = []
        self.subchips: list[dict] = []
        self.wires: list[dict] = []
        # IDs deterministicos derivados do nome do chip, sempre > 1000 para
        # nunca colidirem com os IDs pequenos dos pinos de chips embutidos.
        # crc32 em vez de hash(): hash() de str e aleatorizado a cada processo
        # e os IDs precisam ser estaveis entre execucoes (chips pais referenciam
        # os IDs dos pinos dos filhos).
        self._seed = (zlib.crc32(name.encode("utf-8")) % 900000) + 100000
        self._n = 0

    def _id(self):
        self._n += 1
        return self._seed + self._n * 7

    # ---- pinos do proprio chip -------------------------------------------
    def add_input(self, name, pos, bits=1):
        pin = {
            "Name": name, "ID": self._id(),
            "Position": {"x": pos[0], "y": pos[1]},
            "BitCount": bits, "Colour": 0, "ValueDisplayMode": 0,
        }
        self.inputs.append(pin)
        return ("devin", pin["ID"])

    def add_output(self, name, pos, bits=1):
        pin = {
            "Name": name, "ID": self._id(),
            "Position": {"x": pos[0], "y": pos[1]},
            "BitCount": bits, "Colour": 0, "ValueDisplayMode": 0,
        }
        self.outputs.append(pin)
        return ("devout", pin["ID"])

    # ---- sub-chips --------------------------------------------------------
    def add(self, chip_name, pos):
        """Instancia um sub-chip (embutido ou customizado)."""
        if chip_name in BUILTIN:
            pins = BUILTIN[chip_name]
        elif chip_name in CHIPS:
            d = CHIPS[chip_name]
            pins = {"in": [p["ID"] for p in d["InputPins"]],
                    "out": [p["ID"] for p in d["OutputPins"]]}
        else:
            raise KeyError(f"chip desconhecido: {chip_name}")

        sub_id = self._id()
        self.subchips.append({
            "Name": chip_name, "ID": sub_id, "Label": None,
            "Position": {"x": pos[0], "y": pos[1]},
            "OutputPinColourInfo": [{"PinColour": 0, "PinID": p} for p in pins["out"]],
            "InternalData": None,
        })
        return _Sub(sub_id, pins)

    # ---- ligacoes ---------------------------------------------------------
    def wire(self, src, dst):
        """src/dst sao tuplas de endereco (PinID, PinOwnerID)."""
        s = _addr(src)
        t = _addr(dst)
        self.wires.append({
            "SourcePinAddress": {"PinID": s[0], "PinOwnerID": s[1]},
            "TargetPinAddress": {"PinID": t[0], "PinOwnerID": t[1]},
            "ConnectionType": 0,
            "ConnectedWireIndex": -1,
            "ConnectedWireSegmentIndex": -1,
            "Points": [{"x": 0.0, "y": 0.0}, {"x": 0.0, "y": 0.0}],
        })

    def build(self):
        desc = {
            "DLSVersion": DLS_VERSION,
            "Name": self.name,
            "NameLocation": self.name_location,
            "Size": {"x": self.size[0], "y": self.size[1]},
            "Colour": self.colour,
            "InputPins": self.inputs,
            "OutputPins": self.outputs,
            "SubChips": self.subchips,
            "Wires": self.wires,
            "Displays": [],
            "ChipType": 0,
        }
        CHIPS[self.name] = desc
        ORDER.append(self.name)
        return desc


class _Sub:
    """Instancia de sub-chip; .i(n) e .o(n) devolvem enderecos de pino."""

    def __init__(self, sub_id, pins):
        self.id = sub_id
        self.pins = pins

    def i(self, n):
        return ("pin", self.pins["in"][n], self.id)

    def o(self, n=0):
        return ("pin", self.pins["out"][n], self.id)


def _addr(handle):
    kind = handle[0]
    if kind in ("devin", "devout"):
        # Pino do proprio chip: PinID e sempre 0, o dono e o ID do pino.
        return (0, handle[1])
    return (handle[1], handle[2])


# ==========================================================================
# 1. Chips auxiliares: constantes
# ==========================================================================
def build_constants():
    # CONST-1: NAND com as duas entradas soltas. Entrada solta = 0 no DLS,
    # entao NAND(0,0) = 1.
    c = Chip("CONST-1", COL["const"], size=(0.875, 0.375))
    out = c.add_output("1", (4.0, 0.0))
    n = c.add("NAND", (-1.0, 0.0))
    c.wire(n.o(), out)
    c.build()

    # CONST-0: NAND(1,1) = 0.
    c = Chip("CONST-0", COL["const"], size=(0.875, 0.375))
    out = c.add_output("0", (4.0, 0.0))
    one = c.add("CONST-1", (-3.0, 0.0))
    n = c.add("NAND", (-0.5, 0.0))
    c.wire(one.o(), n.i(0))
    c.wire(one.o(), n.i(1))
    c.wire(n.o(), out)
    c.build()


# ==========================================================================
# 2. Portas basicas de 1 bit, todas a partir da NAND
# ==========================================================================
def build_basic_gates():
    # ---- NOT : NAND(A,A) ------------------------------------------------
    c = Chip("NOT", COL["not"], size=(0.95, 0.375))
    a = c.add_input("A", (-6.5, 0.0))
    out = c.add_output("OUT", (5.0, 0.0))
    n = c.add("NAND", (-1.0, 0.0))
    c.wire(a, n.i(0))
    c.wire(a, n.i(1))
    c.wire(n.o(), out)
    c.build()

    # ---- AND : NOT(NAND(A,B)) -------------------------------------------
    c = Chip("AND", COL["and"], size=(0.7, 0.5))
    a = c.add_input("A", (-7.5, 1.0))
    b = c.add_input("B", (-7.5, -1.0))
    out = c.add_output("OUT", (5.5, 0.0))
    n1 = c.add("NAND", (-2.5, 0.0))
    n2 = c.add("NAND", (0.5, 0.0))
    c.wire(a, n1.i(0))
    c.wire(b, n1.i(1))
    c.wire(n1.o(), n2.i(0))
    c.wire(n1.o(), n2.i(1))
    c.wire(n2.o(), out)
    c.build()

    # ---- OR : De Morgan -> NAND(~A, ~B) ---------------------------------
    c = Chip("OR", COL["or"], size=(0.7, 0.5))
    a = c.add_input("A", (-7.5, 1.0))
    b = c.add_input("B", (-7.5, -1.0))
    out = c.add_output("OUT", (5.5, 0.0))
    na = c.add("NOT", (-4.0, 1.0))
    nb = c.add("NOT", (-4.0, -1.0))
    n = c.add("NAND", (0.5, 0.0))
    c.wire(a, na.i(0))
    c.wire(b, nb.i(0))
    c.wire(na.o(), n.i(0))
    c.wire(nb.o(), n.i(1))
    c.wire(n.o(), out)
    c.build()

    # ---- NOR : NOT(OR) ---------------------------------------------------
    c = Chip("NOR", COL["nor"], size=(0.7, 0.5))
    a = c.add_input("A", (-7.5, 1.0))
    b = c.add_input("B", (-7.5, -1.0))
    out = c.add_output("OUT", (5.5, 0.0))
    o = c.add("OR", (-2.5, 0.0))
    n = c.add("NOT", (1.5, 0.0))
    c.wire(a, o.i(0))
    c.wire(b, o.i(1))
    c.wire(o.o(), n.i(0))
    c.wire(n.o(), out)
    c.build()

    # ---- XOR : (A+B) . ~(A.B) -------------------------------------------
    c = Chip("XOR", COL["xor"], size=(0.7, 0.5))
    a = c.add_input("A", (-7.5, 1.5))
    b = c.add_input("B", (-7.5, -1.5))
    out = c.add_output("OUT", (6.0, 0.0))
    o = c.add("OR", (-3.5, 1.5))
    nd = c.add("NAND", (-3.5, -2.0))
    an = c.add("AND", (1.5, 0.0))
    c.wire(a, o.i(0))
    c.wire(b, o.i(1))
    c.wire(a, nd.i(0))
    c.wire(b, nd.i(1))
    c.wire(o.o(), an.i(0))
    c.wire(nd.o(), an.i(1))
    c.wire(an.o(), out)
    c.build()

    # ---- XNOR : NOT(XOR) -------------------------------------------------
    c = Chip("XNOR", COL["xnor"], size=(0.95, 0.5))
    a = c.add_input("A", (-7.5, 1.0))
    b = c.add_input("B", (-7.5, -1.0))
    out = c.add_output("OUT", (6.0, 0.0))
    x = c.add("XOR", (-2.5, 0.0))
    n = c.add("NOT", (2.0, 0.0))
    c.wire(a, x.i(0))
    c.wire(b, x.i(1))
    c.wire(x.o(), n.i(0))
    c.wire(n.o(), out)
    c.build()


# ==========================================================================
# 3. Bancos de 4 e 8 bits
#
# Estrutura: SPLIT por entrada -> N copias da porta de 1 bit -> MERGE.
# O split entrega o bit i na saida de ID (1+i) e o merge recebe o bit i na
# entrada de ID i, entao a ligacao e direta (mesma ordem dos dois lados).
# ==========================================================================
def build_bank(gate_name, bits, colour):
    split = {4: "4-1BIT", 8: "8-1BIT"}[bits]
    merge = {4: "1-4BIT", 8: "1-8BIT"}[bits]
    n_in = 1 if gate_name == "NOT" else 2
    name = f"{gate_name}-{bits}"

    # Altura proporcional ao numero de portas empilhadas.
    step = 0.6875                       # 5.5 * GRID, igual ao AND-8 original
    top = (bits - 1) * step / 2.0
    height = round(max(0.5, bits * 0.1325), 4)
    c = Chip(name, colour, size=(1.14, height))

    # Pinos do chip
    if n_in == 1:
        ins = [c.add_input(f"IN-{bits}", (-8.25, 0.0), bits)]
        split_pos = [(-4.9275, 0.0)]
    else:
        ins = [c.add_input(f"A ({bits} bits)", (-8.25, top + 1.0), bits),
               c.add_input(f"B ({bits} bits)", (-8.25, -top - 1.0), bits)]
        split_pos = [(-4.9275, top + 1.0), (-4.9275, -top - 1.0)]
    out = c.add_output(f"OUT-{bits}", (6.0, 0.0), bits)

    splits = [c.add(split, p) for p in split_pos]
    for pin, sp in zip(ins, splits):
        c.wire(pin, sp.i(0))

    mg = c.add(merge, (3.1975, 0.0))

    for i in range(bits):
        y = round(top - i * step, 4)
        g = c.add(gate_name, (-0.64, y))
        for j, sp in enumerate(splits):
            c.wire(sp.o(i), g.i(j))
        c.wire(g.o(), mg.i(i))

    c.wire(mg.o(), out)
    c.build()


def build_banks():
    fam = [("NOT", COL["not"]), ("AND", COL["and"]), ("NAND", COL["nand"]),
           ("OR", COL["or"]), ("NOR", COL["nor"]),
           ("XOR", COL["xor"]), ("XNOR", COL["xnor"])]
    for bits in (4, 8):
        for gate, colour in fam:
            build_bank(gate, bits, colour)


# ==========================================================================
# 3b. Portas de 3 entradas
# ==========================================================================
def build_gates3():
    for base, colour in (("AND", COL["and"]), ("OR", COL["or"])):
        c = Chip(f"{base}-3", colour, size=(0.95, 0.625))
        a = c.add_input("A", (-8.0, 2.0))
        b = c.add_input("B", (-8.0, 0.0))
        d = c.add_input("C", (-8.0, -2.0))
        out = c.add_output("OUT", (6.0, 0.0))
        g1 = c.add(base, (-3.0, 1.0))
        g2 = c.add(base, (1.5, 0.0))
        c.wire(a, g1.i(0)); c.wire(b, g1.i(1))
        c.wire(g1.o(), g2.i(0)); c.wire(d, g2.i(1))
        c.wire(g2.o(), out)
        c.build()

    # NAND-3 / NOR-3 = negacao das anteriores
    for base, colour in (("NAND", COL["nand"]), ("NOR", COL["nor"])):
        src = {"NAND": "AND-3", "NOR": "OR-3"}[base]
        c = Chip(f"{base}-3", colour, size=(0.95, 0.625))
        a = c.add_input("A", (-8.0, 2.0))
        b = c.add_input("B", (-8.0, 0.0))
        d = c.add_input("C", (-8.0, -2.0))
        out = c.add_output("OUT", (6.0, 0.0))
        g = c.add(src, (-2.0, 0.0))
        n = c.add("NOT", (2.5, 0.0))
        c.wire(a, g.i(0)); c.wire(b, g.i(1)); c.wire(d, g.i(2))
        c.wire(g.o(), n.i(0)); c.wire(n.o(), out)
        c.build()


# ==========================================================================
# 3c. Aritmetica: meio somador, somador completo e somadores de 4/8 bits
# ==========================================================================
def build_adders():
    # ---- HALF-ADDER : S = A xor B, C = A . B ----------------------------
    c = Chip("HALF-ADDER", COL["quest"], size=(1.3, 0.625), name_location=1)
    a = c.add_input("A", (-8.0, 1.5))
    b = c.add_input("B", (-8.0, -1.5))
    s = c.add_output("S", (6.5, 1.5))
    co = c.add_output("C", (6.5, -1.5))
    x = c.add("XOR", (-1.5, 1.5))
    n = c.add("AND", (-1.5, -1.5))
    c.wire(a, x.i(0)); c.wire(b, x.i(1)); c.wire(x.o(), s)
    c.wire(a, n.i(0)); c.wire(b, n.i(1)); c.wire(n.o(), co)
    c.build()

    # ---- FULL-ADDER : dois meio-somadores + OR --------------------------
    # S = (A xor B) xor Cin ; Cout = A.B + Cin.(A xor B)
    c = Chip("FULL-ADDER", COL["quest"], size=(1.4, 0.75), name_location=1)
    a = c.add_input("A", (-9.0, 2.5))
    b = c.add_input("B", (-9.0, 0.5))
    ci = c.add_input("CIN", (-9.0, -2.5))
    s = c.add_output("S", (7.5, 1.5))
    co = c.add_output("COUT", (7.5, -2.0))
    h1 = c.add("HALF-ADDER", (-4.5, 1.5))
    h2 = c.add("HALF-ADDER", (0.5, 0.0))
    o = c.add("OR", (4.5, -2.0))
    c.wire(a, h1.i(0)); c.wire(b, h1.i(1))
    c.wire(h1.o(0), h2.i(0)); c.wire(ci, h2.i(1))
    c.wire(h2.o(0), s)
    c.wire(h2.o(1), o.i(0)); c.wire(h1.o(1), o.i(1))
    c.wire(o.o(), co)
    c.build()

    # ---- ADDER-4 / ADDER-8 : ripple carry -------------------------------
    for bits in (4, 8):
        split = {4: "4-1BIT", 8: "8-1BIT"}[bits]
        merge = {4: "1-4BIT", 8: "1-8BIT"}[bits]
        step = 0.6875
        top = (bits - 1) * step / 2.0
        c = Chip(f"ADDER-{bits}", COL["quest"],
                 size=(1.5, round(max(0.75, bits * 0.1325), 4)), name_location=1)
        pa = c.add_input(f"A ({bits} bits)", (-9.5, top + 1.5), bits)
        pb = c.add_input(f"B ({bits} bits)", (-9.5, -top - 1.5), bits)
        pci = c.add_input("CIN", (-9.5, -top - 3.0))
        ps = c.add_output(f"S ({bits} bits)", (7.5, 0.0), bits)
        pco = c.add_output("COUT", (7.5, top + 2.0))

        sa = c.add(split, (-5.5, top + 1.5))
        sb = c.add(split, (-5.5, -top - 1.5))
        mg = c.add(merge, (4.0, 0.0))
        c.wire(pa, sa.i(0))
        c.wire(pb, sb.i(0))

        # indice 0 = bit mais significativo, entao o encadeamento do carry
        # comeca no indice bits-1 (LSB) e sobe ate o indice 0 (MSB).
        carry = pci
        for i in range(bits - 1, -1, -1):
            y = round(top - i * step, 4)
            fa = c.add("FULL-ADDER", (-0.5, y))
            c.wire(sa.o(i), fa.i(0))
            c.wire(sb.o(i), fa.i(1))
            c.wire(carry, fa.i(2))
            c.wire(fa.o(0), mg.i(i))
            carry = fa.o(1)
        c.wire(carry, pco)
        c.wire(mg.o(), ps)
        c.build()


# ==========================================================================
# 3d. Selecao: multiplexadores
# ==========================================================================
def build_mux():
    # MUX-2 : SEL=0 -> A , SEL=1 -> B    =>  (~SEL . A) + (SEL . B)
    c = Chip("MUX-2", COL["nor"], size=(1.2, 0.625), name_location=1)
    a = c.add_input("A", (-9.0, 2.5))
    b = c.add_input("B", (-9.0, 0.5))
    sel = c.add_input("SEL", (-9.0, -2.5))
    out = c.add_output("OUT", (7.0, 0.0))
    ns = c.add("NOT", (-6.0, -4.0))
    g0 = c.add("AND", (-2.0, 2.0))
    g1 = c.add("AND", (-2.0, -0.5))
    o = c.add("OR", (2.5, 1.0))
    c.wire(sel, ns.i(0))
    c.wire(a, g0.i(0)); c.wire(ns.o(), g0.i(1))
    c.wire(b, g1.i(0)); c.wire(sel, g1.i(1))
    c.wire(g0.o(), o.i(0)); c.wire(g1.o(), o.i(1))
    c.wire(o.o(), out)
    c.build()

    # Versoes de barramento: SEL unico para todos os bits.
    for bits in (4, 8):
        split = {4: "4-1BIT", 8: "8-1BIT"}[bits]
        merge = {4: "1-4BIT", 8: "1-8BIT"}[bits]
        step = 0.6875
        top = (bits - 1) * step / 2.0
        c = Chip(f"MUX-2-{bits}", COL["nor"],
                 size=(1.4, round(max(0.75, bits * 0.1325), 4)), name_location=1)
        pa = c.add_input(f"A ({bits} bits)", (-9.5, top + 1.5), bits)
        pb = c.add_input(f"B ({bits} bits)", (-9.5, -top - 1.5), bits)
        psel = c.add_input("SEL", (-9.5, -top - 3.0))
        out = c.add_output(f"OUT ({bits} bits)", (7.0, 0.0), bits)
        sa = c.add(split, (-5.5, top + 1.5))
        sb = c.add(split, (-5.5, -top - 1.5))
        mg = c.add(merge, (4.0, 0.0))
        c.wire(pa, sa.i(0)); c.wire(pb, sb.i(0))
        for i in range(bits):
            y = round(top - i * step, 4)
            m = c.add("MUX-2", (-0.5, y))
            c.wire(sa.o(i), m.i(0))
            c.wire(sb.o(i), m.i(1))
            c.wire(psel, m.i(2))
            c.wire(m.o(), mg.i(i))
        c.wire(mg.o(), out)
        c.build()


# ==========================================================================
# 3e. Decodificadores
# ==========================================================================
def build_decoders():
    # DEC-2 : 2 entradas -> 4 saidas (one-hot)
    c = Chip("DEC-2", COL["xnor"], size=(1.2, 0.75), name_location=1)
    s1 = c.add_input("S1", (-8.5, 2.0))
    s0 = c.add_input("S0", (-8.5, -2.0))
    outs = [c.add_output(f"Y{k}", (7.0, 3.0 - k * 2.0)) for k in range(4)]
    n1 = c.add("NOT", (-5.5, 4.0))
    n0 = c.add("NOT", (-5.5, -4.5))
    c.wire(s1, n1.i(0))
    c.wire(s0, n0.i(0))
    # Y0=~S1~S0  Y1=~S1 S0  Y2=S1 ~S0  Y3=S1 S0
    src = [(n1.o(), n0.o()), (n1.o(), s0), (s1, n0.o()), (s1, s0)]
    for k, (u, v) in enumerate(src):
        g = c.add("AND", (1.5, 3.0 - k * 2.0))
        c.wire(u, g.i(0)); c.wire(v, g.i(1)); c.wire(g.o(), outs[k])
    c.build()

    # DEC-3 : 3 entradas -> 8 saidas (one-hot)
    c = Chip("DEC-3", COL["xnor"], size=(1.3, 1.06), name_location=1)
    s2 = c.add_input("S2", (-9.0, 3.0))
    s1 = c.add_input("S1", (-9.0, 0.0))
    s0 = c.add_input("S0", (-9.0, -3.0))
    outs = [c.add_output(f"Y{k}", (7.5, 5.0 - k * 1.4)) for k in range(8)]
    n2 = c.add("NOT", (-6.0, 5.5))
    n1 = c.add("NOT", (-6.0, -5.5))
    n0 = c.add("NOT", (-6.0, -7.0))
    c.wire(s2, n2.i(0)); c.wire(s1, n1.i(0)); c.wire(s0, n0.i(0))
    for k in range(8):
        u = s2 if (k >> 2) & 1 else n2.o()
        v = s1 if (k >> 1) & 1 else n1.o()
        w = s0 if k & 1 else n0.o()
        g = c.add("AND-3", (1.5, 5.0 - k * 1.4))
        c.wire(u, g.i(0)); c.wire(v, g.i(1)); c.wire(w, g.i(2))
        c.wire(g.o(), outs[k])
    c.build()


# ==========================================================================
# 3f. Comparadores de igualdade
# ==========================================================================
def build_comparators():
    for bits in (4, 8):
        split = {4: "4-1BIT", 8: "8-1BIT"}[bits]
        step = 0.6875
        top = (bits - 1) * step / 2.0
        c = Chip(f"EQUALS-{bits}", COL["xnor"],
                 size=(1.4, round(max(0.625, bits * 0.1325), 4)), name_location=1)
        pa = c.add_input(f"A ({bits} bits)", (-9.5, top + 1.5), bits)
        pb = c.add_input(f"B ({bits} bits)", (-9.5, -top - 1.5), bits)
        out = c.add_output("A = B", (8.0, 0.0))
        sa = c.add(split, (-6.0, top + 1.5))
        sb = c.add(split, (-6.0, -top - 1.5))
        c.wire(pa, sa.i(0)); c.wire(pb, sb.i(0))

        # Um XNOR por bit: 1 quando os dois bits sao iguais.
        eq = []
        for i in range(bits):
            y = round(top - i * step, 4)
            g = c.add("XNOR", (-2.0, y))
            c.wire(sa.o(i), g.i(0))
            c.wire(sb.o(i), g.i(1))
            eq.append(g.o())

        # Arvore de AND: todos os bits iguais.
        level, col = eq, 0
        while len(level) > 1:
            nxt = []
            for j in range(0, len(level), 2):
                g = c.add("AND", (1.5 + col * 2.0, round(top - j * step, 4)))
                c.wire(level[j], g.i(0))
                c.wire(level[j + 1], g.i(1))
                nxt.append(g.o())
            level, col = nxt, col + 1
        c.wire(level[0], out)
        c.build()


# ==========================================================================
# 4. Circuitos da atividade
# ==========================================================================
def build_activity():
    # ---- Questao 1 : identidades basicas --------------------------------
    # A+0=A | B+1=1 | C+C=C | D.1=D | E.0=0 | ~(~F)=F
    c = Chip("Q1-IDENTIDADES", COL["quest"], size=(2.0, 2.0), name_location=1)
    ys = [3.75, 2.25, 0.75, -0.75, -2.25, -3.75]
    A = c.add_input("A", (-9.0, ys[0]))
    B = c.add_input("B", (-9.0, ys[1]))
    C = c.add_input("C", (-9.0, ys[2]))
    D = c.add_input("D", (-9.0, ys[3]))
    E = c.add_input("E", (-9.0, ys[4]))
    F = c.add_input("F", (-9.0, ys[5]))
    o1 = c.add_output("A+0", (8.0, ys[0]))
    o2 = c.add_output("B+1", (8.0, ys[1]))
    o3 = c.add_output("C+C", (8.0, ys[2]))
    o4 = c.add_output("D.1", (8.0, ys[3]))
    o5 = c.add_output("E.0", (8.0, ys[4]))
    o6 = c.add_output("~(~F)", (8.0, ys[5]))

    zero = c.add("CONST-0", (-6.0, -5.5))
    one = c.add("CONST-1", (-6.0, -6.5))

    g1 = c.add("OR", (0.0, ys[0]))          # A + 0 = A
    c.wire(A, g1.i(0)); c.wire(zero.o(), g1.i(1)); c.wire(g1.o(), o1)

    g2 = c.add("OR", (0.0, ys[1]))          # B + 1 = 1
    c.wire(B, g2.i(0)); c.wire(one.o(), g2.i(1)); c.wire(g2.o(), o2)

    g3 = c.add("OR", (0.0, ys[2]))          # C + C = C
    c.wire(C, g3.i(0)); c.wire(C, g3.i(1)); c.wire(g3.o(), o3)

    g4 = c.add("AND", (0.0, ys[3]))         # D . 1 = D
    c.wire(D, g4.i(0)); c.wire(one.o(), g4.i(1)); c.wire(g4.o(), o4)

    g5 = c.add("AND", (0.0, ys[4]))         # E . 0 = 0
    c.wire(E, g5.i(0)); c.wire(zero.o(), g5.i(1)); c.wire(g5.o(), o5)

    n1 = c.add("NOT", (-2.0, ys[5]))        # ~(~F) = F
    n2 = c.add("NOT", (2.0, ys[5]))
    c.wire(F, n1.i(0)); c.wire(n1.o(), n2.i(0)); c.wire(n2.o(), o6)
    c.build()

    # ---- Questao 2 : associativa ----------------------------------------
    c = Chip("Q2-ASSOCIATIVA-OU", COL["quest"], size=(2.0, 1.0), name_location=1)
    A = c.add_input("A", (-9.0, 2.5))
    B = c.add_input("B", (-9.0, 0.0))
    C = c.add_input("C", (-9.0, -2.5))
    f1 = c.add_output("A+(B+C)", (8.0, 1.5))
    f2 = c.add_output("(A+B)+C", (8.0, -1.5))
    bc = c.add("OR", (-3.0, 0.5))           # B+C
    t1 = c.add("OR", (1.5, 1.5))            # A+(B+C)
    ab = c.add("OR", (-3.0, -2.0))          # A+B
    t2 = c.add("OR", (1.5, -1.5))           # (A+B)+C
    c.wire(B, bc.i(0)); c.wire(C, bc.i(1))
    c.wire(A, t1.i(0)); c.wire(bc.o(), t1.i(1)); c.wire(t1.o(), f1)
    c.wire(A, ab.i(0)); c.wire(B, ab.i(1))
    c.wire(ab.o(), t2.i(0)); c.wire(C, t2.i(1)); c.wire(t2.o(), f2)
    c.build()

    c = Chip("Q2-ASSOCIATIVA-E", COL["quest"], size=(2.0, 1.0), name_location=1)
    A = c.add_input("A", (-9.0, 2.5))
    B = c.add_input("B", (-9.0, 0.0))
    C = c.add_input("C", (-9.0, -2.5))
    f1 = c.add_output("(A.B).C", (8.0, 1.5))
    f2 = c.add_output("A.(B.C)", (8.0, -1.5))
    ab = c.add("AND", (-3.0, 2.0))
    t1 = c.add("AND", (1.5, 1.5))
    bc = c.add("AND", (-3.0, -0.5))
    t2 = c.add("AND", (1.5, -1.5))
    c.wire(A, ab.i(0)); c.wire(B, ab.i(1))
    c.wire(ab.o(), t1.i(0)); c.wire(C, t1.i(1)); c.wire(t1.o(), f1)
    c.wire(B, bc.i(0)); c.wire(C, bc.i(1))
    c.wire(A, t2.i(0)); c.wire(bc.o(), t2.i(1)); c.wire(t2.o(), f2)
    c.build()

    # ---- Questao 3 : distributiva e fatoracao ---------------------------
    c = Chip("Q3-DISTRIBUTIVA", COL["quest"], size=(2.0, 1.0), name_location=1)
    A = c.add_input("A", (-9.0, 2.5))
    B = c.add_input("B", (-9.0, 0.0))
    C = c.add_input("C", (-9.0, -2.5))
    f1 = c.add_output("A.(B+C)", (8.0, 1.5))
    f2 = c.add_output("A.B+A.C", (8.0, -1.5))
    bc = c.add("OR", (-3.5, 0.5))
    t1 = c.add("AND", (1.5, 1.5))
    ab = c.add("AND", (-3.5, -1.5))
    ac = c.add("AND", (-3.5, -3.0))
    t2 = c.add("OR", (1.5, -2.0))
    c.wire(B, bc.i(0)); c.wire(C, bc.i(1))
    c.wire(A, t1.i(0)); c.wire(bc.o(), t1.i(1)); c.wire(t1.o(), f1)
    c.wire(A, ab.i(0)); c.wire(B, ab.i(1))
    c.wire(A, ac.i(0)); c.wire(C, ac.i(1))
    c.wire(ab.o(), t2.i(0)); c.wire(ac.o(), t2.i(1)); c.wire(t2.o(), f2)
    c.build()

    # MN + ~MN = N
    c = Chip("Q3-FATORACAO", COL["quest"], size=(2.0, 1.0), name_location=1)
    M = c.add_input("M", (-9.0, 2.0))
    N = c.add_input("N", (-9.0, -1.0))
    f1 = c.add_output("MN+~MN", (8.0, 1.5))
    f2 = c.add_output("N", (8.0, -2.0))
    mn = c.add("AND", (-3.0, 2.0))
    nm = c.add("NOT", (-5.5, -3.0))
    nmn = c.add("AND", (-3.0, -0.5))
    t = c.add("OR", (2.0, 1.5))
    c.wire(M, mn.i(0)); c.wire(N, mn.i(1))
    c.wire(M, nm.i(0))
    c.wire(nm.o(), nmn.i(0)); c.wire(N, nmn.i(1))
    c.wire(mn.o(), t.i(0)); c.wire(nmn.o(), t.i(1)); c.wire(t.o(), f1)
    c.wire(N, f2)
    c.build()

    # ---- Questao 4 : simplificacoes -------------------------------------
    # 1) A + AB = A
    c = Chip("Q4-1", COL["quest"], size=(1.6, 0.875), name_location=1)
    A = c.add_input("A", (-9.0, 1.5))
    B = c.add_input("B", (-9.0, -1.5))
    f1 = c.add_output("A+AB", (8.0, 1.5))
    f2 = c.add_output("A", (8.0, -1.5))
    ab = c.add("AND", (-3.5, -0.5))
    t = c.add("OR", (1.5, 1.0))
    c.wire(A, ab.i(0)); c.wire(B, ab.i(1))
    c.wire(A, t.i(0)); c.wire(ab.o(), t.i(1)); c.wire(t.o(), f1)
    c.wire(A, f2)
    c.build()

    # 2) ABC + 1 = 1
    c = Chip("Q4-2", COL["quest"], size=(1.6, 1.0), name_location=1)
    A = c.add_input("A", (-9.0, 2.5))
    B = c.add_input("B", (-9.0, 0.5))
    C = c.add_input("C", (-9.0, -1.5))
    f1 = c.add_output("ABC+1", (8.0, 1.5))
    f2 = c.add_output("1", (8.0, -2.0))
    one = c.add("CONST-1", (-5.0, -4.0))
    one2 = c.add("CONST-1", (2.0, -2.5))
    ab = c.add("AND", (-4.0, 1.5))
    abc = c.add("AND", (-1.0, 0.5))
    t = c.add("OR", (3.0, 1.5))
    c.wire(A, ab.i(0)); c.wire(B, ab.i(1))
    c.wire(ab.o(), abc.i(0)); c.wire(C, abc.i(1))
    c.wire(abc.o(), t.i(0)); c.wire(one.o(), t.i(1)); c.wire(t.o(), f1)
    c.wire(one2.o(), f2)
    c.build()

    # 3) A + AB + ABC = A
    c = Chip("Q4-3", COL["quest"], size=(1.6, 1.0), name_location=1)
    A = c.add_input("A", (-9.0, 2.5))
    B = c.add_input("B", (-9.0, 0.5))
    C = c.add_input("C", (-9.0, -1.5))
    f1 = c.add_output("A+AB+ABC", (8.0, 1.5))
    f2 = c.add_output("A", (8.0, -2.0))
    ab = c.add("AND", (-4.5, 0.5))
    abc = c.add("AND", (-1.5, -1.0))
    t1 = c.add("OR", (0.5, 2.0))
    t2 = c.add("OR", (3.5, 1.5))
    c.wire(A, ab.i(0)); c.wire(B, ab.i(1))
    c.wire(ab.o(), abc.i(0)); c.wire(C, abc.i(1))
    c.wire(A, t1.i(0)); c.wire(ab.o(), t1.i(1))
    c.wire(t1.o(), t2.i(0)); c.wire(abc.o(), t2.i(1)); c.wire(t2.o(), f1)
    c.wire(A, f2)
    c.build()

    # 4) A + ~AB + ~ABC = A + B
    c = Chip("Q4-4", COL["quest"], size=(1.7, 1.0), name_location=1)
    A = c.add_input("A", (-9.5, 2.5))
    B = c.add_input("B", (-9.5, 0.5))
    C = c.add_input("C", (-9.5, -1.5))
    f1 = c.add_output("A+~AB+~ABC", (8.5, 1.5))
    f2 = c.add_output("A+B", (8.5, -2.5))
    na = c.add("NOT", (-7.0, -3.5))
    nab = c.add("AND", (-4.5, 0.5))
    nabc = c.add("AND", (-1.5, -1.0))
    t1 = c.add("OR", (0.5, 2.0))
    t2 = c.add("OR", (3.5, 1.5))
    simp = c.add("OR", (3.5, -2.5))
    c.wire(A, na.i(0))
    c.wire(na.o(), nab.i(0)); c.wire(B, nab.i(1))
    c.wire(nab.o(), nabc.i(0)); c.wire(C, nabc.i(1))
    c.wire(A, t1.i(0)); c.wire(nab.o(), t1.i(1))
    c.wire(t1.o(), t2.i(0)); c.wire(nabc.o(), t2.i(1)); c.wire(t2.o(), f1)
    c.wire(A, simp.i(0)); c.wire(B, simp.i(1)); c.wire(simp.o(), f2)
    c.build()

    # 5) (A+B)(A+C) + A = A + BC
    c = Chip("Q4-5", COL["quest"], size=(1.8, 1.0), name_location=1)
    A = c.add_input("A", (-9.5, 2.5))
    B = c.add_input("B", (-9.5, 0.5))
    C = c.add_input("C", (-9.5, -1.5))
    f1 = c.add_output("(A+B)(A+C)+A", (8.5, 1.5))
    f2 = c.add_output("A+BC", (8.5, -2.5))
    ab = c.add("OR", (-5.5, 2.0))
    ac = c.add("OR", (-5.5, -0.5))
    prod = c.add("AND", (-1.5, 1.0))
    t = c.add("OR", (2.5, 1.5))
    bc = c.add("AND", (-1.5, -3.0))
    simp = c.add("OR", (3.5, -2.5))
    c.wire(A, ab.i(0)); c.wire(B, ab.i(1))
    c.wire(A, ac.i(0)); c.wire(C, ac.i(1))
    c.wire(ab.o(), prod.i(0)); c.wire(ac.o(), prod.i(1))
    c.wire(prod.o(), t.i(0)); c.wire(A, t.i(1)); c.wire(t.o(), f1)
    c.wire(B, bc.i(0)); c.wire(C, bc.i(1))
    c.wire(A, simp.i(0)); c.wire(bc.o(), simp.i(1)); c.wire(simp.o(), f2)
    c.build()

    # ---- Questao 5 : circuito do enunciado ------------------------------
    # Q = (A+B) . (B.C)   ->   Q = B.C
    c = Chip("Q5-ORIGINAL", COL["quest"], size=(1.4, 0.875), name_location=1)
    A = c.add_input("A", (-9.0, 2.5))
    B = c.add_input("B", (-9.0, 0.0))
    C = c.add_input("C", (-9.0, -2.5))
    Q = c.add_output("Q", (8.0, 0.0))
    o = c.add("OR", (-3.5, 1.5))
    a1 = c.add("AND", (-3.5, -1.5))
    a2 = c.add("AND", (2.0, 0.0))
    c.wire(A, o.i(0)); c.wire(B, o.i(1))
    c.wire(B, a1.i(0)); c.wire(C, a1.i(1))
    c.wire(o.o(), a2.i(0)); c.wire(a1.o(), a2.i(1))
    c.wire(a2.o(), Q)
    c.build()

    c = Chip("Q5-SIMPLIFICADO", COL["simpl"], size=(1.4, 0.75), name_location=1)
    B = c.add_input("B", (-9.0, 1.5))
    C = c.add_input("C", (-9.0, -1.5))
    Q = c.add_output("Q", (8.0, 0.0))
    a = c.add("AND", (-1.0, 0.0))
    c.wire(B, a.i(0)); c.wire(C, a.i(1)); c.wire(a.o(), Q)
    c.build()

    # Circuito de prova: as duas versoes lado a lado, mesmas entradas.
    c = Chip("Q5-COMPARACAO", COL["simpl"], size=(2.0, 1.0), name_location=1)
    A = c.add_input("A", (-9.0, 2.5))
    B = c.add_input("B", (-9.0, 0.0))
    C = c.add_input("C", (-9.0, -2.5))
    q1 = c.add_output("Q ORIGINAL", (8.0, 1.5))
    q2 = c.add_output("Q SIMPLIFICADO", (8.0, -1.5))
    orig = c.add("Q5-ORIGINAL", (0.0, 1.5))
    simp = c.add("Q5-SIMPLIFICADO", (0.0, -1.5))
    c.wire(A, orig.i(0)); c.wire(B, orig.i(1)); c.wire(C, orig.i(2))
    c.wire(orig.o(), q1)
    c.wire(B, simp.i(0)); c.wire(C, simp.i(1))
    c.wire(simp.o(), q2)
    c.build()


# ==========================================================================
# 5. ProjectDescription.json
# ==========================================================================
def build_project_description():
    tz = timezone(timedelta(hours=-3))
    now = datetime.now(tz).isoformat(timespec="milliseconds")

    one_bit = ["NOT", "AND", "OR", "NOR", "XOR", "XNOR"]
    four_bit = [f"{g}-4" for g in ("NOT", "AND", "NAND", "OR", "NOR", "XOR", "XNOR")]
    eight_bit = [f"{g}-8" for g in ("NOT", "AND", "NAND", "OR", "NOR", "XOR", "XNOR")]
    gates3 = ["AND-3", "OR-3", "NAND-3", "NOR-3"]
    arith = ["HALF-ADDER", "FULL-ADDER", "ADDER-4", "ADDER-8"]
    select = ["MUX-2", "MUX-2-4", "MUX-2-8", "DEC-2", "DEC-3",
              "EQUALS-4", "EQUALS-8"]
    activity = ["Q1-IDENTIDADES", "Q2-ASSOCIATIVA-OU", "Q2-ASSOCIATIVA-E",
                "Q3-DISTRIBUTIVA", "Q3-FATORACAO",
                "Q4-1", "Q4-2", "Q4-3", "Q4-4", "Q4-5",
                "Q5-ORIGINAL", "Q5-SIMPLIFICADO", "Q5-COMPARACAO"]

    return {
        "ProjectName": PROJECT_NAME,
        "DLSVersion_LastSaved": DLS_VERSION,
        "DLSVersion_EarliestCompatible": "2.0.0",
        "CreationTime": now,
        "LastSaveTime": now,
        "Prefs_MainPinNamesDisplayMode": 2,
        "Prefs_ChipPinNamesDisplayMode": 1,
        "Prefs_GridDisplayMode": 1,
        "Prefs_Snapping": 0,
        "Prefs_StraightWires": 0,
        "Prefs_SimPaused": False,
        "Prefs_SimTargetStepsPerSecond": 150,
        "Prefs_SimStepsPerClockTick": 6,
        "AllCustomChipNames": list(ORDER),
        "StarredList": [
            {"Name": "BASICOS 1 BIT", "IsCollection": True},
            {"Name": "BASICOS 4 BITS", "IsCollection": True},
            {"Name": "BASICOS 8 BITS", "IsCollection": True},
            {"Name": "ATIVIDADE", "IsCollection": True},
        ],
        "ChipCollections": [
            {"Chips": ["NAND"] + one_bit, "IsToggledOpen": True,
             "Name": "BASICOS 1 BIT"},
            {"Chips": four_bit, "IsToggledOpen": True, "Name": "BASICOS 4 BITS"},
            {"Chips": eight_bit, "IsToggledOpen": True, "Name": "BASICOS 8 BITS"},
            {"Chips": gates3, "IsToggledOpen": True, "Name": "3 ENTRADAS"},
            {"Chips": arith, "IsToggledOpen": True, "Name": "ARITMETICA"},
            {"Chips": select, "IsToggledOpen": True,
             "Name": "SELECAO/DECODIFICACAO"},
            {"Chips": activity, "IsToggledOpen": True, "Name": "ATIVIDADE"},
            {"Chips": ["CONST-0", "CONST-1"], "IsToggledOpen": True,
             "Name": "CONSTANTES"},
            {"Chips": ["IN-1", "IN-4", "IN-8", "OUT-1", "OUT-4", "OUT-8"],
             "IsToggledOpen": True, "Name": "IN/OUT"},
            {"Chips": ["1-4BIT", "1-8BIT", "4-8BIT", "8-4BIT", "8-1BIT", "4-1BIT"],
             "IsToggledOpen": True, "Name": "MERGE/SPLIT"},
        ],
    }


# ==========================================================================
def main():
    here = os.path.dirname(os.path.abspath(__file__))
    dest = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "Projects", PROJECT_NAME)

    build_constants()
    build_basic_gates()
    build_banks()
    build_gates3()
    build_adders()
    build_mux()
    build_decoders()
    build_comparators()
    build_activity()

    chips_dir = os.path.join(dest, "Chips")
    os.makedirs(chips_dir, exist_ok=True)

    for name in ORDER:
        path = os.path.join(chips_dir, f"{name}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(CHIPS[name], f, indent=2, ensure_ascii=False)

    with open(os.path.join(dest, "ProjectDescription.json"), "w", encoding="utf-8") as f:
        json.dump(build_project_description(), f, indent=2, ensure_ascii=False)

    print(f"Projeto '{PROJECT_NAME}' gerado em: {dest}")
    print(f"{len(ORDER)} chips criados:")
    for n in ORDER:
        d = CHIPS[n]
        print(f"  - {n:<20} {len(d['SubChips']):>3} sub-chips, {len(d['Wires']):>3} fios")


if __name__ == "__main__":
    main()
