"""Build aligned runtime sprite sheets from the approved transparent key-pose art."""

from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "source"
OUTPUT = ROOT / "assets" / "sprites" / "idle"


def visible_bbox(image: Image.Image):
    return image.getchannel("A").getbbox()


def clear_cell_border(image: Image.Image, width: int = 2):
    alpha = image.getchannel("A")
    pixels = alpha.load()
    for y in range(image.height):
        for x in range(image.width):
            if x < width or y < width or x >= image.width - width or y >= image.height - width:
                pixels[x, y] = 0
    image.putalpha(alpha)


def aligned_sheet(cells, frame_size, padding, filename, destination=OUTPUT):
    boxes = [visible_bbox(cell) for cell in cells]
    if any(box is None for box in boxes):
        raise ValueError(f"Empty animation frame in {filename}")

    max_width = max(box[2] - box[0] for box in boxes)
    max_height = max(box[3] - box[1] for box in boxes)
    scale = min((frame_size - padding * 2) / max_width, (frame_size - padding * 2) / max_height)
    sheet = Image.new("RGBA", (frame_size * len(cells), frame_size))

    for index, (cell, box) in enumerate(zip(cells, boxes)):
        sprite = cell.crop(box)
        width = max(1, round(sprite.width * scale))
        height = max(1, round(sprite.height * scale))
        sprite = sprite.resize((width, height), Image.Resampling.NEAREST)
        x = index * frame_size + (frame_size - width) // 2
        y = frame_size - padding - height
        sheet.alpha_composite(sprite, (x, y))

    destination.mkdir(parents=True, exist_ok=True)
    sheet.save(destination / filename, optimize=True)


def build_generated_animation(source_name, columns, rows, row, frame_size, padding, filename, destination=OUTPUT):
    source = Image.open(SOURCE / source_name).convert("RGBA")
    cell_width = source.width / columns
    cell_height = source.height / rows
    cells = []
    for column in range(columns):
        cell = source.crop((
            round(column * cell_width), round(row * cell_height),
            round((column + 1) * cell_width), round((row + 1) * cell_height),
        ))
        clear_cell_border(cell)
        cells.append(cell)
    aligned_sheet(cells, frame_size, padding, filename, destination)


def build_ui_icons():
    destination = ROOT / "assets" / "sprites" / "icons"
    gameplay_names = (
        "carrot", "dandelion", "hay", "seed",
        "laser", "bottle", "acorn", "meteor",
        "bubble", "stone", "carrot-club", "squeal",
        "roll", "watermelon", "bomb-warning", "bat-swarm",
    )
    for index, name in enumerate(gameplay_names):
        build_generated_animation(
            "gameplay-icons-v1-transparent.png", 4, 4, index // 4,
            48, 3, f"{name}.png", destination,
        )
        # Each row builder creates four frames; retain the requested cell only.
        sheet_path = destination / f"{name}.png"
        sheet = Image.open(sheet_path).convert("RGBA")
        frame = sheet.crop(((index % 4) * 48, 0, (index % 4 + 1) * 48, 48))
        frame.save(sheet_path, optimize=True)

    meta_names = (
        "meta-health", "meta-damage", "meta-speed", "meta-magnet",
        "meta-regen", "meta-fortune", "meta-reroll", "meta-banish",
    )
    for index, name in enumerate(meta_names):
        build_generated_animation(
            "meta-icons-v1-transparent.png", 4, 2, index // 4,
            48, 3, f"{name}.png", destination,
        )
        sheet_path = destination / f"{name}.png"
        sheet = Image.open(sheet_path).convert("RGBA")
        frame = sheet.crop(((index % 4) * 48, 0, (index % 4 + 1) * 48, 48))
        frame.save(sheet_path, optimize=True)


def build_new_enemy_and_boss_animations():
    build_generated_animation("fox-nine-tail-chicken-v3-transparent.png", 6, 1, 0, 96, 3, "fox-boss.png")
    build_generated_animation("weasel-snack-nuggets-v2-transparent.png", 6, 1, 0, 96, 3, "weasel-boss.png")
    build_generated_animation("enemy-mice-bat-v1-transparent.png", 4, 3, 0, 48, 2, "bomb-mouse.png")
    build_generated_animation("enemy-mice-bat-v1-transparent.png", 4, 3, 1, 48, 2, "bully-mouse.png")
    build_generated_animation("enemy-mice-bat-v1-transparent.png", 4, 3, 2, 48, 2, "bat.png")
    for row, prop in enumerate(("fork", "knife", "pen", "bone")):
        build_generated_animation("mouse-weapons-v1-transparent.png", 4, 4, row, 48, 2, f"mouse-{prop}.png")


def build_player_action_animations():
    build_generated_animation("archer-actions-v1-transparent.png", 6, 2, 0, 64, 2, "archer-attack.png")
    build_generated_animation("archer-actions-v1-transparent.png", 6, 2, 1, 64, 2, "archer-roll.png")
    build_generated_animation("melon-actions-v1-transparent.png", 6, 2, 0, 64, 2, "melon-attack.png")
    build_generated_animation("melon-actions-v1-transparent.png", 6, 2, 1, 64, 2, "melon-eat.png")


def build_idle_characters():
    source = Image.open(SOURCE / "idle-keyposes-transparent.png").convert("RGBA")
    x_spans = [(144, 404), (456, 726), (788, 1046), (1101, 1373)]
    y_spans = [(30, 186), (211, 353), (369, 509), (514, 773), (806, 958)]
    names = ["minion-mouse.png", "archer-guinea.png", "gatherer-hamster.png", None, "nugget.png"]

    for row, filename in enumerate(names):
        if not filename:
            continue
        cells = [source.crop((x0, y_spans[row][0], x1, y_spans[row][1])) for x0, x1 in x_spans]
        aligned_sheet(cells, 48, 2, filename)


def build_owl():
    source = Image.open(SOURCE / "owl-wing-flap-6frames-transparent.png").convert("RGBA")
    cell_width = source.width // 6
    cells = []
    for index in range(6):
        left = index * cell_width
        right = source.width if index == 5 else (index + 1) * cell_width
        cell = source.crop((left, 0, right, source.height))
        clear_cell_border(cell)
        cells.append(cell)
    aligned_sheet(cells, 96, 3, "owl-boss.png")


def build_props():
    source = Image.open(SOURCE / "pixel-props-transparent.png").convert("RGBA")
    names = [
        "pot", "chest", "coin", "xp-crystal",
        "heart", "freeze", "flame", "magnet",
        "rock", "fence", "berry-bush", "supply-crate",
    ]
    destination = ROOT / "assets" / "sprites" / "props"
    destination.mkdir(parents=True, exist_ok=True)
    cell_width = source.width / 4
    cell_height = source.height / 3

    for index, name in enumerate(names):
        column = index % 4
        row = index // 4
        bounds = (
            round(column * cell_width), round(row * cell_height),
            round((column + 1) * cell_width), round((row + 1) * cell_height),
        )
        cell = source.crop(bounds)
        clear_cell_border(cell)
        box = visible_bbox(cell)
        if box is None:
            raise ValueError(f"Empty prop cell: {name}")
        sprite = cell.crop(box)
        scale = min(42 / sprite.width, 42 / sprite.height)
        sprite = sprite.resize((max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))), Image.Resampling.NEAREST)
        frame = Image.new("RGBA", (48, 48))
        frame.alpha_composite(sprite, ((48 - sprite.width) // 2, 46 - sprite.height))
        frame.save(destination / f"{name}.png", optimize=True)


def build_garden_food():
    source = Image.open(SOURCE / "garden-food-transparent.png").convert("RGBA")
    names = [
        "snack-carrot", "snack-pea", "snack-apple", "snack-cookie",
        "watering-can", "daisies", "dandelion", "clover",
        "stepping-stones", "carrot-patch", "blue-flowers", "leaf-pile",
    ]
    destination = ROOT / "assets" / "sprites" / "garden"
    destination.mkdir(parents=True, exist_ok=True)
    cell_width = source.width / 4
    cell_height = source.height / 3

    for index, name in enumerate(names):
        column = index % 4
        row = index // 4
        cell = source.crop((
            round(column * cell_width), round(row * cell_height),
            round((column + 1) * cell_width), round((row + 1) * cell_height),
        ))
        clear_cell_border(cell)
        box = visible_bbox(cell)
        if box is None:
            raise ValueError(f"Empty garden cell: {name}")
        sprite = cell.crop(box)
        scale = min(42 / sprite.width, 42 / sprite.height)
        sprite = sprite.resize((max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))), Image.Resampling.NEAREST)
        frame = Image.new("RGBA", (48, 48))
        frame.alpha_composite(sprite, ((48 - sprite.width) // 2, 46 - sprite.height))
        frame.save(destination / f"{name}.png", optimize=True)


def optimize_static_bosses():
    destination = ROOT / "assets" / "sprites"
    for filename in ("boss-weasel-128.png", "boss-fox-128.png", "boss-owl-128.png"):
        path = destination / filename
        if not path.exists():
            continue
        image = Image.open(path).convert("RGBA")
        if image.size != (96, 96):
            image = image.resize((96, 96), Image.Resampling.NEAREST)
        image.save(path, optimize=True)


if __name__ == "__main__":
    build_idle_characters()
    build_owl()
    build_props()
    build_garden_food()
    build_new_enemy_and_boss_animations()
    build_player_action_animations()
    build_ui_icons()
    optimize_static_bosses()
    print(f"Built pixel sprite sheets in {OUTPUT}")
