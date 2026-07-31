# Tuntun Survivors Pixel Art Direction

## Display target

- Desktop is the primary composition and keeps the existing full-screen layout.
- Mobile uses landscape orientation and preserves the same composition without stretching characters.
- The Canvas renders at device-pixel ratio 1. This is intentional: it lowers fill cost and keeps the art visibly pixelated on high-density screens.

## Runtime sprite sizes

- Standard characters: 48×48 pixels per frame, displayed around 68–78 CSS pixels.
- Bosses: 96×96 pixels per frame, displayed at 118 CSS pixels or larger.
- Props and pickups: 48×48 pixels, displayed between 24 and 92 CSS pixels according to gameplay importance.
- Scaling must use nearest-neighbor rendering. Do not add blur, interpolation, or smooth vector redraws.

## Animation language

- Idle animation is deliberately slow and readable: four frames for characters.
- Nugget breathes through the belly; scarf and satchel settle one frame later.
- Minion mouse ears, tail, and spoon follow the torso with a slight delay.
- Archer body breathes while the headband and bow rebound subtly.
- Gatherer hat, backpack, and fruit move with the body.
- Owl Boss uses six true wing positions from highest to lowest. The body moves opposite the wings and the lantern trails behind.
- Do not animate the whole character by uniformly scaling it up and down.

## Palette and shapes

- Warm cream highlights, brown outlines, garden greens, orange-gold accents.
- Use large color clusters and a dark 1–2 pixel outline.
- Text remains normal UI text for readability; panels, bars, and buttons use square pixel-art framing.
- Background tiles, paths, garden plots, props, enemies, and pickups must all use the same hard-edged pixel treatment.

## Asset build

Run:

```powershell
python scripts/build-pixel-sprites.py
node scripts/merge-bilingual.mjs
```

The large approved key-pose sheets live under `assets/source/`. The game only loads the optimized files under `assets/sprites/`.
