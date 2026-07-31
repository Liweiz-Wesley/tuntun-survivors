import { readFile, writeFile } from "node:fs/promises";

const chinese = await readFile("source/Tuntun-Survivors-Chinese.html");
const english = await readFile("source/Tuntun-Survivors-English.html");
const zh64 = chinese.toString("base64");
const en64 = english.toString("base64");

const merged = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>豚豚大暴走 / Tuntun Survivors</title>
  <style>
    *{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden;background:#a9d98d}
    #gameFrame{display:block;width:100%;height:100%;border:0}
    .language-picker{position:fixed;z-index:99999;right:16px;bottom:16px;display:flex;align-items:center;gap:8px;padding:8px 10px;border:2px solid rgba(255,255,255,.9);border-radius:15px;background:rgba(255,249,233,.92);box-shadow:0 5px 18px rgba(49,65,42,.24);font:700 13px system-ui,sans-serif;color:#465c42;backdrop-filter:blur(8px)}
    .language-picker select{border:1px solid #cbbd9f;border-radius:9px;padding:6px 9px;background:white;color:#43583f;font:700 13px system-ui,sans-serif;cursor:pointer}
    @media(max-width:600px){.language-picker{right:8px;bottom:8px;padding:6px 8px}.language-picker span{display:none}}
  </style>
</head>
<body>
  <iframe id="gameFrame" title="Tuntun Survivors"></iframe>
  <label class="language-picker"><span>🌐 语言 / Language</span><select id="languageSelect" aria-label="Language"><option value="zh">中文</option><option value="en">English</option></select></label>
  <script>
    const pages={zh:"${zh64}",en:"${en64}"};
    const decode=value=>new TextDecoder().decode(Uint8Array.from(atob(value),c=>c.charCodeAt(0)));
    const frame=document.querySelector('#gameFrame'),select=document.querySelector('#languageSelect');
    let language=localStorage.getItem('tuntun-language')||'zh';
    if(!pages[language])language='zh';
    select.value=language;
    const loadLanguage=lang=>{document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=lang==='zh'?'豚豚大暴走':'Tuntun Survivors';frame.title=document.title;frame.srcdoc=decode(pages[lang]);};
    select.addEventListener('change',()=>{language=select.value;localStorage.setItem('tuntun-language',language);loadLanguage(language);});
    loadLanguage(language);
  </script>
</body>
</html>`;

await writeFile("index.html", merged);
