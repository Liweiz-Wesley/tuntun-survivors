"""Build brighter, higher-contrast food sprites without touching CC0 sources."""

from pathlib import Path
import subprocess

from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "assets/third_party/oga/food/food-ocal/32x32"
OUTPUT_ROOT = ROOT / "assets/generated/food-vivid"


def tracked_food_files() -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "assets/third_party/oga/food/food-ocal/32x32/**/*.png"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return [ROOT / line for line in result.stdout.splitlines() if line.strip()]


def polish(source: Path, target: Path) -> None:
    image = Image.open(source).convert("RGBA")
    alpha = image.getchannel("A")
    rgb = image.convert("RGB")
    rgb = ImageEnhance.Color(rgb).enhance(1.38)
    rgb = ImageEnhance.Contrast(rgb).enhance(1.2)
    rgb = ImageEnhance.Brightness(rgb).enhance(1.06)
    vivid = rgb.convert("RGBA")
    vivid.putalpha(alpha)

    # A one-pixel opaque contour keeps silhouettes readable after mobile scaling.
    expanded = alpha.filter(ImageFilter.MaxFilter(3))
    outline_alpha = expanded.point(lambda value: min(235, value))
    outline_alpha = Image.eval(outline_alpha, lambda value: value)
    for y in range(image.height):
        for x in range(image.width):
            if alpha.getpixel((x, y)):
                outline_alpha.putpixel((x, y), 0)
    outlined = Image.new("RGBA", image.size, (43, 29, 35, 0))
    outlined.putalpha(outline_alpha)
    result = Image.alpha_composite(outlined, vivid)

    # Add a restrained pixel bevel: warm top-left highlights and deep lower edges.
    pixels = result.load()
    source_alpha = alpha.load()
    for y in range(image.height):
        for x in range(image.width):
            if source_alpha[x, y] < 28:
                continue
            r, g, b, a = pixels[x, y]
            top = source_alpha[x, max(0, y - 1)]
            left = source_alpha[max(0, x - 1), y]
            bottom = source_alpha[x, min(image.height - 1, y + 1)]
            right = source_alpha[min(image.width - 1, x + 1), y]
            if top < 28 or left < 28:
                pixels[x, y] = (
                    min(255, int(r * .82 + 255 * .18)),
                    min(255, int(g * .82 + 244 * .18)),
                    min(255, int(b * .82 + 205 * .18)),
                    a,
                )
            elif bottom < 28 or right < 28:
                pixels[x, y] = (int(r * .62), int(g * .6), int(b * .64), a)

    target.parent.mkdir(parents=True, exist_ok=True)
    result.save(target, optimize=True)


def main() -> None:
    files = tracked_food_files()
    for source in files:
        polish(source, OUTPUT_ROOT / source.relative_to(SOURCE_ROOT))
    print(f"Generated {len(files)} vivid food sprites in {OUTPUT_ROOT}")


if __name__ == "__main__":
    main()
