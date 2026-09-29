# Banco de efeitos sonoros sintetizados (sem licença de terceiro).
# Rodar: uv run --with numpy --with scipy scripts/gerar_sfx.py
import numpy as np
from pathlib import Path
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 48000
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, ataque=0.002, decai=0.1):
    x = np.arange(n) / SR
    a = np.clip(x / max(ataque, 1e-6), 0, 1)
    return a * np.exp(-x / decai)


def banda(sinal, lo, hi, ordem=4):
    sos = butter(ordem, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, sinal)


def passa_baixa(sinal, f, ordem=4):
    return sosfilt(butter(ordem, f, btype="low", fs=SR, output="sos"), sinal)


def reverb(sinal, tempo=0.35, mix=0.18):
    n = int(SR * tempo)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * tempo / 5))
    ir = passa_baixa(ir, 6000)
    seco = np.pad(sinal, (0, n))
    molhado = np.convolve(sinal, ir)[: len(seco)]
    molhado = np.pad(molhado, (0, len(seco) - len(molhado)))
    molhado /= np.max(np.abs(molhado)) + 1e-9
    return seco + mix * molhado * np.max(np.abs(sinal))


def salva(nome, sinal, pico=0.8):
    sinal = sinal / (np.max(np.abs(sinal)) + 1e-9) * pico
    fade = min(len(sinal), int(SR * 0.01))
    sinal[-fade:] *= np.linspace(1, 0, fade)
    wavfile.write(OUT / f"{nome}.wav", SR, (sinal * 32767).astype(np.int16))
    print(nome, f"{len(sinal) / SR:.2f}s")


# clique do cursor: estalo curto e seco (estilo trackpad)
d = t(0.05)
clique = banda(rng.standard_normal(len(d)), 2500, 9000) * env(len(d), 0.0005, 0.006)
clique += 0.5 * np.sin(2 * np.pi * 1800 * d) * env(len(d), 0.0005, 0.01)
salva("clique", clique, 0.55)

# toque em botão: "pop" com queda de tom
d = t(0.12)
f = 700 * np.exp(-d * 18) + 260
pop = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(d), 0.001, 0.035)
salva("pop", reverb(pop, 0.2, 0.12), 0.6)

# tecla (digitação): clique mais grave e aleatório
for i in range(3):
    d = t(0.04)
    k = banda(rng.standard_normal(len(d)), 1200 + i * 300, 5000) * env(len(d), 0.0005, 0.008)
    salva(f"tecla{i + 1}", k, 0.35)

# whoosh: ruído com filtro que varre, sobe e desce
d = t(0.42)
ruido = rng.standard_normal(len(d))
blocos = np.array_split(np.arange(len(d)), 40)
w = np.zeros(len(d))
for j, idx in enumerate(blocos):
    c = 400 + 3200 * np.sin(np.pi * j / 40) ** 2
    w[idx] = banda(ruido, c * 0.6, min(c * 1.6, 20000))[idx]
w *= np.sin(np.pi * np.clip(d / 0.42, 0, 1)) ** 2.2
salva("whoosh", w, 0.45)

# swoosh curto (troca de tela, cartão girando)
d = t(0.28)
s = banda(rng.standard_normal(len(d)), 900, 6000) * np.sin(np.pi * d / 0.28) ** 3
salva("swoosh", s, 0.4)

# ding de sucesso: dois parciais brilhantes com cauda
d = t(1.2)
ding = sum(a * np.sin(2 * np.pi * fr * d) * np.exp(-d / dc) for fr, a, dc in [(1318.5, 1, 0.45), (1975.5, 0.55, 0.3), (2637, 0.25, 0.2), (659.3, 0.2, 0.5)])
ding *= np.clip(d / 0.003, 0, 1)
salva("ding", reverb(ding, 0.6, 0.2), 0.6)

# notificação: duas notas rápidas (subindo)
d = t(0.7)
def nota(fr, ini):
    x = np.clip(d - ini, 0, None)
    return (np.sin(2 * np.pi * fr * x) + 0.3 * np.sin(2 * np.pi * fr * 2 * x)) * np.exp(-x / 0.18) * (d >= ini)
notif = nota(1046.5, 0) + nota(1568, 0.09)
salva("notificacao", reverb(notif, 0.4, 0.15), 0.5)

# ilha abrindo: bolha grave e macia
d = t(0.3)
f = 180 + 260 * (1 - np.exp(-d * 25))
ilha = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(d), 0.004, 0.08)
salva("ilha", reverb(ilha, 0.25, 0.1), 0.5)

# moeda / valor rolando: tique metálico curto
d = t(0.08)
tq = (np.sin(2 * np.pi * 3200 * d) + 0.6 * np.sin(2 * np.pi * 4700 * d)) * env(len(d), 0.0005, 0.012)
salva("tique", tq, 0.3)

# impacto da marca: grave + brilho
d = t(1.6)
grave = np.sin(2 * np.pi * (55 + 40 * np.exp(-d * 8)) * d) * np.exp(-d / 0.45)
brilho = banda(rng.standard_normal(len(d)), 3000, 12000) * np.exp(-d / 0.25) * 0.25
sub = passa_baixa(rng.standard_normal(len(d)), 200) * np.exp(-d / 0.15) * 0.6
impacto = (grave + brilho + sub) * np.clip(d / 0.004, 0, 1)
salva("impacto", reverb(impacto, 0.9, 0.25), 0.85)

# riser: sobe antes da marca
d = t(0.8)
r = banda(rng.standard_normal(len(d)), 500, 9000) * (d / 0.8) ** 2.5
r += 0.25 * np.sin(2 * np.pi * np.cumsum(200 + 900 * (d / 0.8) ** 2) / SR) * (d / 0.8) ** 2
salva("riser", r, 0.4)
