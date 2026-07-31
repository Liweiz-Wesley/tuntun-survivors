# 豚豚大暴走 / Tuntun Survivors

一款可爱豚鼠主题的类 Vampire Survivors 网页游戏，支持中文和 English。

## 在线游玩

GitHub Pages 部署完成后，可直接在浏览器中游玩。

## 本地游玩

下载或克隆仓库后，直接双击 `index.html`，不需要安装，也不需要联网。

## 更新双语版本

1. 分别修改 `source/Tuntun-Survivors-Chinese.html` 和 `source/Tuntun-Survivors-English.html`。
2. 安装 Node.js。
3. 在仓库根目录运行：

   ```powershell
   node scripts/merge-bilingual.mjs
   ```

4. 检查 `index.html` 后提交并推送到 `main`。GitHub Pages 会自动更新。

切换语言会重新加载游戏，因此建议在主菜单中切换。

