from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]


def save(img, rel):
    target = ROOT / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    img.save(target)


def clean_archer():
    src = Image.open(ROOT / "assets/sprites/idle/archer-guinea.png").convert("RGBA")
    px = src.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b, a = px[x, y]
            if a and r > 60 and b > 55 and r > g * 1.30 and b > g * 1.25:
                light = max(r, b)
                px[x, y] = ((82, 56, 48, a) if light > 120 else (48, 35, 34, a))
    save(src, "assets/generated/characters/archer-idle-clean.png")


def melon_idle():
    strip = Image.open(ROOT / "assets/sprites/idle/melon-attack.png").convert("RGBA")
    base = strip.crop((5 * 64, 0, 6 * 64, 64))
    out = Image.new("RGBA", (256, 64))
    poses = [(0, 0, 0), (-1, -1, 0), (0, 0, 1), (-1, -1, 1)]
    for i, (body_dy, head_dy, head_dx) in enumerate(poses):
        frame = Image.new("RGBA", (64, 64))
        # Feet stay planted; torso breathes one pixel and the head lags sideways.
        frame.alpha_composite(base.crop((0, 38, 64, 64)), (0, 38))
        frame.alpha_composite(base.crop((0, 27, 64, 45)), (0, 27 + body_dy))
        frame.alpha_composite(base.crop((0, 0, 64, 34)), (head_dx, head_dy))
        out.alpha_composite(frame, (i * 64, 0))
    save(out, "assets/generated/characters/melon-idle-clean.png")


def ground_tile():
    img = Image.new("RGBA", (32, 32), (144, 207, 82, 255))
    d = ImageDraw.Draw(img)
    # Sparse, hand-placed diagonal grass tufts; designed to tile without a visible grid.
    for x, y in [(3, 6), (19, 3), (11, 16), (27, 19), (4, 28), (22, 29)]:
        d.point((x, y), fill=(92, 161, 72, 255))
        d.point((x + 1, y - 1), fill=(92, 161, 72, 255))
        d.point((x + 2, y), fill=(179, 224, 99, 255))
    save(img, "assets/generated/environment/kingdom-grass-32.png")


def tree_tile():
    img = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    outline = (42, 91, 49, 255)
    dark = (57, 126, 55, 255)
    mid = (82, 162, 64, 255)
    light = (132, 198, 74, 255)
    d.rectangle((14, 23, 18, 31), fill=(98, 62, 39, 255))
    d.rectangle((12, 28, 20, 31), fill=(78, 52, 37, 255))
    for box in [(2, 9, 18, 25), (10, 3, 28, 23), (5, 2, 21, 19)]:
        d.ellipse(box, fill=outline)
    for box in [(4, 9, 17, 22), (12, 5, 26, 21), (7, 4, 20, 18)]:
        d.ellipse(box, fill=dark)
    d.ellipse((6, 7, 18, 18), fill=mid)
    d.ellipse((13, 7, 24, 17), fill=mid)
    d.rectangle((9, 7, 13, 10), fill=light)
    d.rectangle((17, 9, 20, 12), fill=light)
    save(img, "assets/generated/environment/kingdom-tree-32.png")


def carrot_greatsword():
    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    edge = (55, 42, 36, 255)
    shadow = (166, 66, 28, 255)
    orange = (239, 117, 34, 255)
    light = (255, 176, 58, 255)
    steel = (100, 102, 105, 255)
    # Oversized carrot blade points right; chunky 2px/4px steps read clearly in combat.
    blade = [(8, 20), (44, 20), (58, 30), (44, 42), (8, 42)]
    d.polygon(blade, fill=edge)
    d.polygon([(11, 23), (43, 23), (53, 30), (42, 38), (11, 38)], fill=orange)
    d.polygon([(13, 24), (42, 24), (49, 29), (17, 29)], fill=light)
    d.rectangle((18, 32, 39, 35), fill=shadow)
    d.rectangle((5, 17, 10, 45), fill=steel)
    d.rectangle((2, 20, 6, 42), fill=edge)
    d.rectangle((0, 27, 8, 34), fill=(120, 82, 50, 255))
    d.rectangle((0, 27, 3, 34), fill=edge)
    # Leaf pommel.
    d.polygon([(2, 29), (0, 20), (7, 25)], fill=(67, 130, 51, 255))
    d.polygon([(2, 31), (0, 40), (8, 35)], fill=(91, 166, 57, 255))
    save(img, "assets/generated/weapons/carrot-greatsword-64.png")


if __name__ == "__main__":
    clean_archer()
    melon_idle()
    ground_tile()
    tree_tile()
    carrot_greatsword()
