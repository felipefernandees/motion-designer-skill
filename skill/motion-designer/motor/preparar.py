#!/usr/bin/env python3
"""Prepara um reels pra edição completa no motion-studio (Remotion).

Uso: preparar.py <id> <bruto.MP4> <cortes.json>
  cortes.json = [[inicio_s, fim_s, "texto EXATO que ele fala nesse take"], ...] na ordem do vídeo.
  Escolha os takes com motor/takes.sh (regra: o ÚLTIMO take de cada fala). Dê ~0,08s de folga antes e ~0,1s depois.
Gera:
  public/brutos/<id>.mp4    proxy H.264 1080x1920 30fps (o bruto 4K HEVC do DJI não serve direto)
  public/edicoes/<id>.json  {segs, words}: falas no tempo da edição + tempo de cada palavra
                            (texto vem do cortes.json, tempo vem do whisper; a transcrição erra nomes)
"""
import json, os, subprocess, sys, tempfile
from pathlib import Path
ID, BRUTO, CORTES = sys.argv[1], Path(sys.argv[2]), Path(sys.argv[3])
MS = Path(os.environ.get("MOTION_STUDIO", Path(__file__).resolve().parents[3] / "studio")) / "public"
MODELO = os.environ.get("WHISPER_MODELO", str(Path.home() / ".cache/whisper-cpp/ggml-base.bin"))
(MS / "brutos").mkdir(exist_ok=True); (MS / "edicoes").mkdir(exist_ok=True)
c = json.loads(CORTES.read_text())
T = Path(tempfile.mkdtemp())
proxy = MS / "brutos" / f"{ID}.mp4"
if not proxy.exists():
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(BRUTO), "-map", "0:v:0", "-map", "0:a:0", "-vf", "scale=1080:1920,fps=30",
                    "-c:v", "libx264", "-crf", "18", "-preset", "fast", "-pix_fmt", "yuv420p", "-g", "30", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", str(proxy)], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(BRUTO), "-vn", "-ac", "1", "-ar", "16000", str(T / "a.wav")], check=True)
for i, (a, b, _) in enumerate(c):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(a), "-to", str(b), "-i", str(T / "a.wav"), str(T / f"c{i}.wav")], check=True)
(T / "l.txt").write_text("\n".join(f"file 'c{i}.wav'" for i in range(len(c))))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-i", str(T / "l.txt"), str(T / "e.wav")], check=True)
subprocess.run(["whisper-cli", "-m", MODELO, "-l", os.environ.get("WHISPER_LINGUA", "pt"), "-ml", "1", "-sow", "-oj",
                "-of", str(T / "w"), "-np", "-f", str(T / "e.wav")], check=True, capture_output=True)
ww = [s["offsets"]["from"] / 1000 for s in json.loads((T / "w.json").read_text())["transcription"] if s["text"].strip()]
segs, words, t = [], [], 0.0
for a, b, txt in c:
    segs.append({"start": round(t, 3), "end": round(t + b - a, 3), "media_start": a, "text": txt}); t += b - a
for si, s in enumerate(segs):
    ws = [x for x in ww if s["start"] - .05 <= x < s["end"] - .05]
    toks = s["text"].split(); n = len(toks)
    for i, tok in enumerate(toks):
        st = ws[round(i * (len(ws) - 1) / max(1, n - 1))] if ws else s["start"] + (s["end"] - s["start"]) * i / n
        words.append({"w": tok, "t": round(max(st, s["start"]), 2), "seg": si})
for i in range(1, len(words)):
    if words[i]["t"] <= words[i - 1]["t"]: words[i]["t"] = round(words[i - 1]["t"] + .08, 2)
(MS / "edicoes" / f"{ID}.json").write_text(json.dumps({"segs": segs, "words": words}, ensure_ascii=False, indent=1))
print(f"ok · {ID} · {round(t, 2)}s · {len(segs)} falas · {len(words)} palavras · public/brutos/{ID}.mp4 + public/edicoes/{ID}.json")
