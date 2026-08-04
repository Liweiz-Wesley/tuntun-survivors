# Game feel acceptance checklist

Use this checklist during every relevant phase. Mark items only after testing the actual browser build.

## Controls

- [ ] Movement responds immediately.
- [ ] Releasing movement does not leave visible drift or a stuck direction.
- [ ] Blur, tab switch, pause, and modal entry clear active movement.
- [ ] Mobile joystick does not cover critical HUD or action buttons.
- [ ] Clicking UI never triggers movement, attacks, or skills underneath.
- [ ] Keyboard and touch produce the same normalized movement intent.

## UI

- [ ] Every major button has default, hover, pressed, disabled, and focus-visible states where applicable.
- [ ] Clickable and disabled controls are visually distinguishable.
- [ ] Panel edge spacing is consistent.
- [ ] Text remains crisp and readable.
- [ ] Icons and labels do not visibly misalign.
- [ ] No major button leaves the viewport at tested desktop/mobile sizes.
- [ ] Pixel assets use nearest-neighbor rendering.

## Combat

- [ ] A normal hit is clearly perceptible without excessive flash.
- [ ] Critical hits differ from normal hits in text, color, sound, or impact.
- [ ] Enemy death is unambiguous.
- [ ] Damage text does not cover most of the battlefield.
- [ ] Screen shake remains low enough to preserve control and aiming.
- [ ] Hit-stop/time scaling is brief and does not accumulate.
- [ ] Frame rate remains acceptable at the intended enemy cap.

## Audio

- [ ] Major buttons have click feedback.
- [ ] Pickup, level-up, normal hit, critical hit, and kill sounds are distinguishable.
- [ ] Repeated sounds are concurrency-limited and do not clip explosively.
- [ ] Master, music, and SFX settings work and persist.
- [ ] Mute persists and audio unlocks correctly after mobile user interaction.

## Stability

- [ ] A run can start, play, end, and restart.
- [ ] Repeated navigation does not multiply event listeners or intervals.
- [ ] A long/stress run does not show continuous memory growth.
- [ ] No recurring unhandled console errors occur.
- [ ] No required resource returns 404.
- [ ] GitHub Pages output matches the generated local build.

