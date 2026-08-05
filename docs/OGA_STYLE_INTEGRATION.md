# OpenGameArt 资源接入准则（Tuntun Survivors）

目标：只吸收“同一套像素语言”里合适的资源，避免把不同作者、不同像素密度、不同描边习惯的素材硬拼在一起。

## 当前选择

- 音效
  - `assets/third_party/oga/sounds/SoundPack01/`
  - 用途：金币、升级、开箱、技能、Boss 警报等基础反馈
  - 原因：短、清楚、复古，不会和现在的像素战斗节奏打架

- 战斗特效
  - `assets/third_party/oga/fx/free-pixel-effects-pack/`
  - 当前接入：
    - `10_weaponhit_spritesheet.png`：命中火花
    - `9_brightfire_spritesheet.png`：喷火/火焰环绕
  - 原因：同一作者、同一像素密度、颜色足够亮，适合统一技能表现

- 爆炸特效
  - `assets/third_party/oga/explosion/Explosion21.png`
  - 当前接入：爆炸补强层
  - 说明：作为辅助爆炸帧使用，不单独定义整套视觉语言

- 食物/遗物候选
  - `assets/third_party/oga/food/food-ocal/32x32/`
  - 建议：只从这一套里挑遗物和蔬菜图标，不混入别的食物包
  - 原因：单作者、单尺寸、32x32 输出稳定，最适合做局外背包/遗物图标

- 农场作物
  - `assets/third_party/oga/crops/FarmingCrops16x16/`
  - 建议：统一作为种植生长阶段素材来源
  - 原因：16x16 小规格很适合农田格子，不会和战斗区大精灵抢细节

## 不建议的做法

- 不要把多个作者的食物图标混在同一个背包页
- 不要同时混用粗描边和无描边特效
- 不要把高饱和暖色爆炸和低对比冷色 UI 直接并排使用
- 不要为了“素材多”把所有 OGA 资源都放进游戏

## 后续统一方向

1. 战斗内动态效果优先使用 `free-pixel-effects-pack`
2. 食物/遗物/UI 图标优先使用 `food-ocal` 单套资源
3. 农场成长阶段优先使用 `[LPC] Crops` 的五阶段作物，`FarmingCrops16x16` 仅作为低分辨率备选

## [LPC] Crops 署名与许可证

- 页面：https://opengameart.org/content/lpc-crops
- 本地原始文件：`assets/third_party/oga/crops-lpc/crops-v2.1/crops-v2/crops.png`
- 完整署名文件：`assets/third_party/oga/crops-lpc/crops-v2.1/crops-v2/CREDITS-crops.txt`
- 许可证：CC-BY-SA 3.0+ 或 GPL 3.0+
- 署名："[LPC] Crops" by bluecarrot16, Daniel Eddeland (daneeklu), Joshua Taylor, Richard Kettering (Jetrel). Commissioned by castelonia.

发布版本必须让玩家可以直接查看完整的 `CREDITS-crops.txt`；不得删除或隐藏该文件。
4. 新增资源时，先检查：
   - 是否是 16x16 / 32x32 像素体系
   - 是否有明确描边
   - 是否是偏可爱明亮的花园像素风
   - 是否会和主角/Nugget、鼠类敌人、Boss 的现有风格冲突

## 当前已落地

- 外部像素命中特效已接入战斗
- 外部爆炸帧已接入爆炸表现
- 外部火焰帧已接入喷火环绕表现
- 外部基础 SFX 已接入音频调用链，缺失时保留原合成音兜底

下一轮建议：把遗物图标、蔬菜技能图标、农作物成长阶段，全部限定在上述三套素材体系里继续做。

## Additional CC0 assets

- Main menu panel reference: `https://opengameart.org/content/main-menu-panel`
  - Author: OhjiroChan
  - License: CC0
  - Usage: layout and framing reference only; the shipped menu keeps Tuntun's own green/gold palette and text.
- Main menu music loop: `https://opengameart.org/content/main-menu-music-loop`
  - Author: Pro Sensory / Alex McCulloch
  - License: CC0
  - Local file: `assets/third_party/oga/music/main-menu-loop/main_menu_music_mastered.mp3`
- Rotating coin: `https://opengameart.org/content/rotating-coin`
  - Author: Puddin
  - License: CC0
  - Local files: `assets/third_party/oga/coin-rotating/files/`
- Pixel chest and coin: `https://opengameart.org/content/pixel-chest-and-coin`
  - Author: hippo
  - License: CC0
  - Local files: `assets/third_party/oga/pixel-chest-and-coin/`
- Crazy Critters movement reference: `https://opengameart.org/content/crazy-critters`
  - Author: GrafxKid
  - License: CC0; credit requested by the author.
  - Local reference: `assets/third_party/oga/crazy-critters/Crazy-Critters-OGA.png`
  - Usage: movement timing and silhouette-change reference only. Tuntun characters keep their original designs and custom sprite sheets.
