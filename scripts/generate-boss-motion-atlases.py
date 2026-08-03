from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "sprites" / "bosses"
CELL = 192
OUTPUT_CELL = 128
MOVE_FRAMES = 6
SKILL_FRAMES = 8

QUADRUPEDS = {"fox", "weasel", "wildcat"}
VEHICLES = {"toycar", "mower"}


def layer_crop(image: Image.Image, box: tuple[int, int, int, int]) -> Image.Image:
    layer = Image.new("RGBA", image.size)
    layer.paste(image.crop(box), box[:2])
    return layer


def shifted(layer: Image.Image, dx: int = 0, dy: int = 0, angle: float = 0, pivot=(96, 96)) -> Image.Image:
    if angle:
        layer = layer.rotate(angle, resample=Image.Resampling.NEAREST, center=pivot)
    out = Image.new("RGBA", layer.size)
    out.alpha_composite(layer, (dx, dy))
    return out


def scale_about(image: Image.Image, sx: float, sy: float, center=(96, 108)) -> Image.Image:
    w, h = max(1, round(CELL * sx)), max(1, round(CELL * sy))
    scaled = image.resize((w, h), Image.Resampling.NEAREST)
    x = round(center[0] - center[0] * sx)
    y = round(center[1] - center[1] * sy)
    out = Image.new("RGBA", (CELL, CELL))
    out.alpha_composite(scaled, (x, y))
    return out


def pose(base: Image.Image, boss: str, phase: float, action: int = -1) -> Image.Image:
    s = math.sin(phase * math.tau)
    c = math.cos(phase * math.tau)
    if action >= 0:
        anticipation = math.sin(min(1.0, phase * 1.7) * math.pi)
        recoil = math.sin(max(0.0, phase - .38) / .62 * math.pi)
    else:
        anticipation = recoil = 0

    if boss == "owl":
        body = layer_crop(base, (58, 34, 138, 164))
        left = layer_crop(base, (4, 18, 83, 144))
        right = layer_crop(base, (112, 18, 190, 144))
        lantern = layer_crop(base, (113, 112, 174, 190))
        out = Image.new("RGBA", base.size)
        flap = s * (22 if action < 0 else 35)
        out.alpha_composite(shifted(left, angle=-flap, pivot=(76, 82)))
        out.alpha_composite(shifted(right, angle=flap, pivot=(118, 82)))
        out.alpha_composite(shifted(body, dy=round(-abs(s) * 3)))
        out.alpha_composite(shifted(lantern, dx=round(s * 4), dy=round(abs(s) * 2), angle=s * 8, pivot=(135, 125)))
        return out

    if boss in QUADRUPEDS:
        upper = layer_crop(base, (0, 0, CELL, 142))
        left_leg = layer_crop(base, (18, 126, 96, CELL))
        right_leg = layer_crop(base, (92, 126, CELL, CELL))
        tail = layer_crop(base, (0, 54, 78, 158))
        out = Image.new("RGBA", base.size)
        stride = round(s * (6 if action < 0 else 12))
        out.alpha_composite(shifted(left_leg, dx=stride, dy=round(max(0, c) * -3)))
        out.alpha_composite(shifted(right_leg, dx=-stride, dy=round(max(0, -c) * -3)))
        out.alpha_composite(shifted(tail, dy=round(s * 5), angle=s * 5, pivot=(66, 110)))
        out.alpha_composite(shifted(upper, dy=round(abs(s) * -3), angle=(-anticipation * 8 + recoil * 6) if action >= 0 else s * 1.4, pivot=(105, 115)))
        return out

    if boss in VEHICLES:
        chassis = layer_crop(base, (0, 0, CELL, 154))
        out = Image.new("RGBA", base.size)
        out.alpha_composite(shifted(chassis, dy=round(s * 2), angle=(s * 1.6 if action < 0 else -anticipation * 5 + recoil * 4), pivot=(96, 125)))
        for box, pivot in [((25, 123, 82, 184), (54, 153)), ((108, 123, 174, 185), (140, 154))]:
            wheel = layer_crop(base, box)
            out.alpha_composite(shifted(wheel, angle=phase * 180 * (1 if action < 0 else 2), pivot=pivot))
        return out

    if boss == "snake":
        body = layer_crop(base, (18, 86, 183, 188))
        head = layer_crop(base, (56, 4, 151, 121))
        out = Image.new("RGBA", base.size)
        out.alpha_composite(scale_about(body, 1 + s * .035, 1 - s * .035, (98, 143)))
        out.alpha_composite(shifted(head, dx=round(s * (5 if action < 0 else 16)), dy=round(-abs(s) * 5), angle=s * 3, pivot=(99, 106)))
        return out

    if boss in {"spider", "mantis"}:
        upper = layer_crop(base, (44, 10, 151, 150))
        left = layer_crop(base, (0, 70, 100, CELL))
        right = layer_crop(base, (92, 70, CELL, CELL))
        out = Image.new("RGBA", base.size)
        out.alpha_composite(shifted(left, dx=round(s * 5), dy=round(c * 3)))
        out.alpha_composite(shifted(right, dx=round(-s * 5), dy=round(-c * 3)))
        out.alpha_composite(shifted(upper, dy=round(-abs(s) * 3), angle=s * 2, pivot=(96, 118)))
        return out

    if boss == "hand":
        palm = layer_crop(base, (25, 47, 189, 186))
        fingers = layer_crop(base, (9, 3, 160, 105))
        out = Image.new("RGBA", base.size)
        out.alpha_composite(shifted(palm, dy=round(abs(s) * -3)))
        out.alpha_composite(shifted(fingers, dx=round(s * (4 if action < 0 else 10)), dy=round(-anticipation * 10), angle=(-anticipation + recoil) * 8, pivot=(127, 91)))
        return out

    if boss == "mole":
        mound = layer_crop(base, (0, 103, CELL, CELL))
        body = layer_crop(base, (32, 15, 167, 151))
        out = Image.new("RGBA", base.size)
        out.alpha_composite(mound)
        out.alpha_composite(shifted(body, dy=round((abs(s) * -4) + anticipation * 14 - recoil * 18), angle=s * 2, pivot=(98, 135)))
        return out

    if boss == "raccoon":
        legs = layer_crop(base, (30, 130, 166, CELL))
        body = layer_crop(base, (0, 0, CELL, 166))
        out = Image.new("RGBA", base.size)
        out.alpha_composite(shifted(legs, dx=round(s * 3)))
        out.alpha_composite(shifted(body, dy=round(abs(s) * -3), angle=s * 1.5, pivot=(96, 145)))
        return out

    if boss == "foot":
        lift = round(max(0, s) * (4 if action < 0 else 22))
        return shifted(base, dy=-lift, angle=(-anticipation * 8 + recoil * 5), pivot=(123, 146))

    return shifted(base, dy=round(-abs(s) * 3), angle=s * 1.5)


def pixel_line(draw: ImageDraw.ImageDraw, points, fill, width=4):
    draw.line([(round(x), round(y)) for x, y in points], fill=fill, width=width, joint="curve")


def add_skill_fx(frame: Image.Image, boss: str, skill: int, p: float) -> None:
    d = ImageDraw.Draw(frame)
    pulse = math.sin(p * math.pi)
    col = ["#f7c95f", "#8fd65b", "#83d8e8", "#f08565"][skill]
    if skill == 0:
        r = round(30 + 55 * p)
        d.arc((96-r, 96-r, 96+r, 96+r), 205, 335, fill=col, width=5)
        d.arc((96-r-8, 96-r-8, 96+r+8, 96+r+8), 25, 155, fill=col, width=3)
    elif skill == 1:
        for i in range(5):
            y = 58 + i * 15
            x = round(12 + (1-p) * 55 + (i % 2) * 9)
            pixel_line(d, [(x, y), (x+42+round(30*p), y)], col, 4)
    elif skill == 2:
        for i in range(9):
            a = i * math.tau / 9 + p * 2.4
            r = 35 + (i % 3) * 16 + p * 22
            x, y = 96 + math.cos(a)*r, 104 + math.sin(a)*r*.58
            d.rectangle((round(x)-3, round(y)-3, round(x)+4, round(y)+4), fill=col)
    else:
        r = round(34 + 58 * pulse)
        d.ellipse((96-r, 104-r*.55, 96+r, 104+r*.55), outline=col, width=5)

    # Identity-specific effect accents keep skills readable in a crowd.
    if boss == "mole" and skill in (1, 3):
        for x in range(35, 165, 22): d.polygon([(x,154),(x+7,134-round(p*18)),(x+14,154)], fill="#91623d")
    elif boss == "snake" and skill == 2:
        d.ellipse((124,72,155+round(p*28),91), fill="#8acb48", outline="#385f2a", width=3)
    elif boss == "spider" and skill in (0,2,3):
        for a in range(0,360,45):
            x=96+math.cos(math.radians(a))*70;y=104+math.sin(math.radians(a))*44
            pixel_line(d,[(96,104),(x,y)],"#eee3c4",2)
    elif boss == "owl" and skill == 2:
        d.polygon([(116,105),(190,80),(190,130)], fill=(255,224,119,150))
    elif boss == "fox" and skill == 2:
        for i in range(9):
            a=-1.7+i*.42+p*.8; x=82+math.cos(a)*75;y=112+math.sin(a)*42
            d.arc((x-18,y-18,x+18,y+18),30,310,fill="#ffb45e",width=4)
    elif boss in VEHICLES and skill in (1,3):
        for i in range(5):
            x=35+i*28;y=155+(i%2)*7;d.rectangle((x,y,x+8,y+8),fill="#84735b")
    elif boss == "foot" and skill in (0,1,2):
        r=round(18+80*p);d.ellipse((96-r,151-r*.28,96+r,151+r*.28),outline="#8a5d3b",width=6)
    elif boss == "hand" and skill in (0,3):
        r=round(20+60*p);d.ellipse((96-r,152-r*.25,96+r,152+r*.25),outline="#695044",width=5)


def make_strip(base: Image.Image, boss: str, frames: int, action: int) -> Image.Image:
    strip = Image.new("RGBA", (OUTPUT_CELL * frames, OUTPUT_CELL))
    for i in range(frames):
        phase = i / frames
        frame = pose(base, boss, phase, action)
        if action >= 0:
            add_skill_fx(frame, boss, action, i / (frames - 1))
        frame = frame.resize((OUTPUT_CELL, OUTPUT_CELL), Image.Resampling.NEAREST)
        strip.alpha_composite(frame, (i * OUTPUT_CELL, 0))
    return strip


def main() -> None:
    for path in sorted(SRC.glob("*.png")):
        boss = path.stem
        if boss == "mantis":
            continue
        base = Image.open(path).convert("RGBA")
        out = SRC / f"{boss}-animation"
        out.mkdir(parents=True, exist_ok=True)
        make_strip(base, boss, MOVE_FRAMES, -1).save(out / "move-strip.png", optimize=True)
        for skill in range(4):
            make_strip(base, boss, SKILL_FRAMES, skill).save(out / f"skill-{skill}-strip.png", optimize=True)
        print(f"generated {boss}: move + 4 skills")


if __name__ == "__main__":
    main()
