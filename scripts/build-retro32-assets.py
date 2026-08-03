"""Compile the current art library into a consistent 32 px logical pixel style.

The source artwork remains untouched. Runtime code loads the mirrored files from
``assets/retro32`` and enlarges them with nearest-neighbour interpolation.
"""

from __future__ import annotations

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "sprites"
OUTPUT = ROOT / "assets" / "retro32" / "sprites"
BACKGROUND_SOURCE = ROOT / "assets" / "backgrounds" / "battle-meadow-source.png"
BACKGROUND_OUTPUT = ROOT / "assets" / "retro32" / "backgrounds" / "battle-meadow-256.png"


def frame_count(path: Path, image: Image.Image) -> int:
    relative = path.relative_to(SOURCE).as_posix()
    if "-animation/" in relative and path.name == "move-strip.png":
        return 6
    if "-animation/" in relative and "strip.png" in path.name:
        return 8
    if relative == "effects/chili-flamethrower-strip.png":
        return 8
    if relative.startswith("idle/"):
        if path.name in {"archer-attack.png", "archer-roll.png", "melon-attack.png", "melon-eat.png"}:
            return 6
        if path.name in {"fox-boss.png", "owl-boss.png", "weasel-boss.png"}:
            return 6
        return 4
    return 1


def clean_alpha(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    for y in range(image.height):
        for x in range(image.width):
            r, g, b, a = pixels[x, y]
            # Remove the bright magenta key colour that survived in a few sheets.
            keyed = r > 205 and b > 170 and g < 80
            pixels[x, y] = (r, g, b, 0 if keyed or a < 96 else 255)
    return image


def quantize_rgba(image: Image.Image, colors: int = 24) -> Image.Image:
    alpha = image.getchannel("A")
    rgb = Image.new("RGB", image.size, (0, 0, 0))
    rgb.paste(image.convert("RGB"), mask=alpha)
    indexed = rgb.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    result = indexed.convert("RGBA")
    result.putalpha(alpha)
    return result


def compile_sheet(path: Path) -> None:
    source = clean_alpha(Image.open(path))
    relative = path.relative_to(SOURCE).as_posix()
    if relative == "farm/farm-map.png":
        # Maps use a low-resolution scene canvas, not a square sprite cell.
        scene = source.resize((320, 180), Image.Resampling.NEAREST)
        scene = quantize_rgba(scene, 40)
        destination = OUTPUT / path.relative_to(SOURCE)
        destination.parent.mkdir(parents=True, exist_ok=True)
        scene.save(destination, optimize=True)
        return
    frames = frame_count(path, source)
    frame_width = source.width // frames
    # Effect frames need a wide logical canvas; every character, boss, item and
    # icon is a true 32 x 32 logical cell.
    logical_width = 64 if path.as_posix().endswith("chili-flamethrower-strip.png") else 32
    sheet = Image.new("RGBA", (logical_width * frames, 32), (0, 0, 0, 0))
    for index in range(frames):
        left = index * frame_width
        frame = source.crop((left, 0, left + frame_width, source.height))
        frame = frame.resize((logical_width, 32), Image.Resampling.NEAREST)
        sheet.alpha_composite(frame, (index * logical_width, 0))
    sheet = quantize_rgba(sheet, 28 if frames > 1 else 20)
    destination = OUTPUT / path.relative_to(SOURCE)
    destination.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(destination, optimize=True)


def compile_background() -> None:
    source = Image.open(BACKGROUND_SOURCE).convert("RGB")
    # A 256 px world tile keeps the field bright and readable while avoiding a
    # huge texture in memory. It is displayed only at integer scale.
    tile = source.resize((128, 128), Image.Resampling.NEAREST)
    tile = tile.quantize(colors=40, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    BACKGROUND_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    tile.save(BACKGROUND_OUTPUT, optimize=True)


def main() -> None:
    count = 0
    for path in sorted(SOURCE.rglob("*.png")):
        relative = path.relative_to(SOURCE).as_posix()
        if "/source/" in relative or relative.endswith("-alpha.png") or relative.endswith("-source.png") or relative.endswith("-contact.png"):
            continue
        compile_sheet(path)
        count += 1
    compile_background()
    print(f"Compiled {count} sprite assets and one battle background into {OUTPUT.parent}")


if __name__ == "__main__":
    main()
