/* Character scale, idle animation, garden tiles and carrot-greatsword polish. */
(()=>{
const addPixel=(key,src)=>{const img=new Image();img.decoding="async";img.src=src;pixelArt[key]=img;};
addPixel("archerClean","assets/generated/characters/archer-idle-clean.png");
addPixel("melonIdle","assets/generated/characters/melon-idle-clean.png");
addPixel("archerAttackClean","assets/generated/characters/archer-attack-normalized.png");
addPixel("archerRollClean","assets/generated/characters/archer-roll-normalized.png");
addPixel("melonAttackClean","assets/generated/characters/melon-attack-normalized.png");
addPixel("melonEatClean","assets/generated/characters/melon-eat-normalized.png");
addPixel("carrotGreatsword","assets/generated/weapons/carrot-greatsword-64.png");
for(let i=1;i<=5;i++)addPixel(`chestTier${i}`,`assets/generated/chests/chest-tier-${i}.png`);

// Mobile landscape controls: keep the game view unobstructed while exposing a
// translucent joystick, character skill button and a compact crop button.
const mobilePad=document.createElement("div");mobilePad.id="mobileControls";mobilePad.innerHTML=`<div id="mobileStick" class="mobile-stick"><i></i></div><div class="mobile-actions"><button id="mobileSkill" class="mobile-action mobile-skill" aria-label="角色技能">技能</button><button id="mobileCrop" class="mobile-action mobile-crop" aria-label="蔬菜技能">E</button></div>`;document.body.appendChild(mobilePad);
const mobileStick=mobilePad.querySelector("#mobileStick"),stickKnob=mobileStick.querySelector("i"),mobileSkill=mobilePad.querySelector("#mobileSkill"),mobileCrop=mobilePad.querySelector("#mobileCrop");
const moveStick=e=>{const r=mobileStick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),cap=r.width*.34,m=Math.min(1,cap/Math.max(1,len));pointer.active=true;pointer.ox=cx;pointer.oy=cy;pointer.x=cx+dx*m;pointer.y=cy+dy*m;stickKnob.style.transform=`translate(${dx*m}px,${dy*m}px)`;};
mobileStick.addEventListener("pointerdown",e=>{e.preventDefault();mobileStick.setPointerCapture?.(e.pointerId);moveStick(e);},{passive:false});
mobileStick.addEventListener("pointermove",e=>{if(e.buttons)moveStick(e);},{passive:false});
const releaseStick=()=>{pointer.active=false;stickKnob.style.transform="translate(0,0)";};mobileStick.addEventListener("pointerup",releaseStick);mobileStick.addEventListener("pointercancel",releaseStick);mobileStick.addEventListener("lostpointercapture",releaseStick);
mobileSkill.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();activateSkill();},{passive:false});mobileCrop.addEventListener("pointerdown",e=>{e.preventDefault();e.stopPropagation();activateCropSkill();},{passive:false});
const syncMobileButtons=()=>{const name=document.querySelector("#skillName")?.textContent||"技能";mobileSkill.textContent=name.replace(/\s*(SPACE|空格)\s*$/i,"").trim()||"技能";mobileCrop.textContent=equippedCrop?"E":"—";mobileCrop.classList.toggle("ready",!!equippedCrop&&cropCooldown<=0);mobileCrop.classList.toggle("empty",!equippedCrop);};setInterval(syncMobileButtons,220);
const mobileStyle=document.createElement("style");mobileStyle.textContent=`
#mobileControls{display:none;position:fixed;inset:0;z-index:20;pointer-events:none;touch-action:none}
.mobile-stick{position:absolute;left:clamp(14px,4vw,46px);bottom:clamp(14px,5vh,42px);width:clamp(82px,15vw,128px);height:clamp(82px,15vw,128px);border:2px solid rgba(255,245,201,.42);border-radius:50%;background:rgba(28,39,48,.22);box-shadow:inset 0 0 0 10px rgba(255,255,255,.05),0 3px 12px rgba(0,0,0,.2);pointer-events:auto}
.mobile-stick i{position:absolute;left:50%;top:50%;width:42%;height:42%;transform:translate(-50%,-50%);border:2px solid rgba(255,248,207,.65);border-radius:50%;background:rgba(255,239,154,.26);box-shadow:0 2px 8px rgba(0,0,0,.2);transition:transform .04s}
.mobile-actions{position:absolute;right:clamp(14px,4vw,46px);bottom:clamp(14px,5vh,42px);display:flex;align-items:end;gap:clamp(8px,2vw,18px);pointer-events:none}
.mobile-action{width:clamp(54px,10vw,82px);height:clamp(54px,10vw,82px);padding:5px;border:2px solid rgba(255,245,201,.55);border-radius:50%;color:#fff8d2;background:rgba(37,50,61,.38);box-shadow:inset 0 0 0 4px rgba(255,255,255,.06),0 3px 12px rgba(0,0,0,.2);font:900 clamp(9px,1.5vw,14px) inherit;text-shadow:1px 1px #33251f;pointer-events:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mobile-action:active{transform:scale(.92);background:rgba(255,220,112,.48)}.mobile-skill{width:clamp(66px,12vw,96px);height:clamp(66px,12vw,96px);border-color:rgba(255,226,125,.7);background:rgba(91,72,42,.38)}.mobile-crop{width:clamp(48px,8vw,66px);height:clamp(48px,8vw,66px);font-size:clamp(11px,2vw,17px)}.mobile-crop.ready{border-color:#ffe777;box-shadow:0 0 0 2px rgba(255,231,119,.55),0 0 16px rgba(255,205,72,.65)}.mobile-crop.empty{opacity:.45}
@media (pointer:coarse) and (orientation:landscape){#mobileControls{display:block}#hud{padding:7px}.topbar{gap:4px;transform:scale(.68);transform-origin:top center}.pill{padding:4px 8px;border-width:2px;border-radius:9px;font-size:9px}.pill b{font-size:14px}.bars{left:8px;top:8px;width:clamp(150px,22vw,220px)}.bar{height:15px;margin-bottom:3px;border-width:2px;border-radius:7px}.bar span{font-size:8px;padding:0 4px;text-shadow:0 1px 1px #604}.skill-row{gap:3px}.crop-row{gap:3px}.crop-skill{flex-basis:28px;height:20px;border-width:2px;border-radius:5px}.crop-skill img,.crop-skill .crop-ready-fill{inset:1px;width:23px;height:16px}.crop-skill>b{font-size:6px}.crop-sd{display:none}#weaponTray{right:8px;top:8px;gap:3px;transform:scale(.62);transform-origin:top right}.weapon-chip{width:44px;height:44px;border-width:2px;border-radius:8px;font-size:20px}.boss-hud{top:38px;width:42vw;font-size:9px}.boss-hud>div{height:8px;border-width:2px}.modal-card{width:92vw;max-height:90vh;overflow:auto;padding:12px;border-width:3px;border-radius:12px}.modal-card h2{font-size:clamp(20px,4vw,30px);margin:3px 0}.modal-card>p{font-size:10px;margin:2px 0}.choices{grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:6px}.choice{min-height:0;height:auto;padding:7px 5px;border-width:2px;border-radius:8px}.choice .icon{font-size:28px}.choice h3{font-size:11px;margin:2px 0}.choice p{font-size:8px;line-height:1.2;max-height:30px;overflow:hidden}.choice .effect{margin-top:3px;padding:3px;font-size:8px;line-height:1.15}.choice small{margin-top:3px;font-size:7px}.evolution-hint{gap:2px;margin-top:3px;padding:2px;font-size:7px}.evolution-hint .pixel-ui-icon{width:17px;height:17px}.level-build{gap:3px;margin:4px 0 2px;padding:4px;border-radius:7px}.level-build-chip{width:24px;height:24px;border-radius:5px;font-size:13px}.level-build-chip small{min-width:11px;height:11px;font-size:7px}.level-actions{gap:4px;margin-top:5px}.level-actions button{min-width:82px;padding:5px 7px;font-size:9px}.mascot{font-size:28px}}
@media (pointer:coarse) and (orientation:portrait){#mobileControls{display:none}#hud{padding:6px}.bars{left:7px;top:7px;width:160px}.topbar{transform:scale(.62);transform-origin:top center}.weapon-chip{width:40px;height:40px}.modal-card{width:94vw;max-height:88vh;padding:10px}.choices{grid-template-columns:1fr;gap:6px}.choice{min-height:86px;padding:7px}.choice .icon{font-size:25px}}
`;document.head.appendChild(mobileStyle);

function chestTierFor(c){if(c?.kind==="final")return 5;if(c?.kind==="boss")return Math.max(2,Math.min(4,c.tier||2));return 1;}
const legacyDrawChestPolish=drawChest;
drawChest=function(c){const tier=chestTierFor(c),img=pixelArt[`chestTier${tier}`];if(!img||!img.complete||!img.naturalWidth)return legacyDrawChestPolish(c);const frame=Math.floor(elapsed*7.7)%8;ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(img,frame*96,0,96,96,Math.round(c.x-48),Math.round(c.y-48),96,96);ctx.restore();};
const legacyOpenChestPolish=openChest;
openChest=function(c){const tier=chestTierFor(c),result=legacyOpenChestPolish(c),stage=document.querySelector('.chest-stage img');if(stage){stage.src=`assets/generated/chests/chest-tier-${tier}.gif`;stage.style.imageRendering="pixelated";}return result;};
const legacyClaimChestRewardPolish=claimChestReward;
claimChestReward=function(){const stage=document.querySelector('.chest-stage img');legacyClaimChestRewardPolish();if(stage){stage.removeAttribute("src");stage.style.backgroundImage="none";}ui.chest?.classList.remove("evolution-reward");};

// Keep the archer portrait and in-run sprite on the same cleaned, slingshot-themed source.
const legacyRenderCharacterSelect=renderCharacterSelect;
renderCharacterSelect=function(){legacyRenderCharacterSelect();const portrait=document.querySelector('.character-card [aria-label="弹弓豚鼠"],.character-card [aria-label="Archer Guinea Pig"]');if(portrait)portrait.style.backgroundImage="url('assets/generated/characters/archer-idle-clean.png')";};

// Character cards are rebuilt from the bilingual source; select the legacy archer image by its URL
// so the cleaned portrait is used regardless of localized aria-label encoding.
const legacyRenderCharacterSelectClean=renderCharacterSelect;
renderCharacterSelect=function(){legacyRenderCharacterSelectClean();const portrait=[...document.querySelectorAll('.character-portrait')].find(p=>p.style.backgroundImage.includes('archer-guinea.png'));if(portrait)portrait.style.backgroundImage="url('assets/generated/characters/archer-idle-clean.png')";};

// The shared internal id is still `carrot`, but its upgrade card must describe
// the selected guinea pig's actual starter weapon.
const starterUpgrade=upgrades.find(u=>u.id==="carrot");
const legacyRenderUpgradeChoicesCharacter=renderUpgradeChoices;
renderUpgradeChoices=function(){
  if(starterUpgrade){
    const rabbit=selectedCharacter==="rabbit",heavy=selectedCharacter==="chinchilla";
    starterUpgrade.name=tr(rabbit?"胡萝卜箭强化":heavy?"萝卜巨剑强化":"旋转胡萝卜",rabbit?"Carrot Arrow Upgrade":heavy?"Carrot Greatsword Upgrade":"Spinning Carrot");
    starterUpgrade.icon=rabbit?"🏹":heavy?"🗡️":"🥕";
    starterUpgrade.desc=tr(rabbit?"提升胡萝卜箭的伤害、穿透和数量。":heavy?"提升萝卜巨剑的范围、伤害和击退。":"提升旋转胡萝卜的伤害、数量和穿透。",rabbit?"Improves carrot arrow damage, pierce and count.":heavy?"Improves carrot greatsword range, damage and knockback.":"Improves spinning carrot damage, count and pierce.");
  }
  legacyRenderUpgradeChoicesCharacter();
};

// Food projectiles were overpowering the small 32px characters; halve only projectile art, not hitboxes.
const legacyDrawPixelProjectile=drawPixelProjectile;
drawPixelProjectile=function(key,x,y,size,rot=0,alpha=1){return legacyDrawPixelProjectile(key,x,y,String(key).startsWith("proj")?size*.5:size,rot,alpha);};
const legacyDrawRotatingCoinPolish=drawRotatingCoin;
drawRotatingCoin=function(x,y,size=42,bob=0){return legacyDrawRotatingCoinPolish(x,y,Math.min(30,size),bob);};

// Give low-level food weapons a readable identity and a gentle one-projectile start.
for(const [id,patch] of Object.entries({
  tomato:{count:1,damage:14,pattern:"radial",motion:"spiral"},
  milkWave:{count:1,damage:15,pattern:"single",motion:"wave"},
  tacoCyclone:{count:1,damage:14,pattern:"single",motion:"boomerang"},
  burgerGuard:{count:1,damage:16,pattern:"orbit",motion:"orbit"},
  broccoli:{count:1,damage:16,pattern:"single",motion:"boomerang"}
})){
  const def=EXTRA_FOOD_DEFS.find(w=>w.id===id);if(def)Object.assign(def,patch);
}

const legacyDrawPixelPlayer=drawPixelPlayer;
drawPixelPlayer=function(){
  if(selectedCharacter!=="rabbit"&&selectedCharacter!=="chinchilla"&&selectedCharacter!=="tuntun")return legacyDrawPixelPlayer();
  ctx.save();ctx.fillStyle="rgba(52,61,40,.22)";ctx.fillRect(Math.round(player.x-23),Math.round(player.y+18),46,8);ctx.restore();
  if(player.inv>0&&playerAction.type!=="roll"&&Math.floor(player.inv*14)%2)return true;
  const progress=playerAction.duration?1-playerAction.timer/playerAction.duration:0;
  const actionFrame=Math.min(5,Math.max(0,Math.floor(progress*6)));
  if(selectedCharacter==="rabbit"){
    if(playerAction.type){
      const rolling=playerAction.type==="roll";
      return drawPixelFrameAt(rolling?"archerRollClean":"archerClean",rolling?6:4,rolling?actionFrame:actionFrame%4,player.x,player.y+42,116,player.facing);
    }
    const idleFrame=Math.floor(elapsed*3.15)%4;
    return drawPixelFrameAt("archerClean",4,idleFrame,player.x,player.y+42,116,player.facing);
  }
  if(selectedCharacter==="chinchilla"){
    if(playerAction.type)return drawPixelFrameAt(playerAction.type==="eat"?"melonEatClean":"melonAttackClean",6,actionFrame,player.x,player.y+42,112,player.facing);
    const idleFrame=Math.floor(elapsed*2.85)%4;
    return drawPixelFrameAt("melonIdle",4,idleFrame,player.x,player.y+42,112,player.facing);
  }
  const walkFrame=Math.floor(elapsed*2.7)%4;
  return drawPixelFrameAt("nugget",4,walkFrame,player.x,player.y+43,108,player.facing);
};

const legacyDrawCarrotBubbleGuard=drawCarrot;
drawCarrot=function(s){
  if(s&&typeof s.kind==="string"&&s.kind.startsWith("shakeBubble")){
    s.r=Math.min(54,s.r||20);const evo=s.kind.endsWith("Evolved"),key=evo?"projShakeBubbleEvolved":"projShakeBubble";
    ctx.save();ctx.globalAlpha=evo?.72:.58;ctx.strokeStyle=evo?"#9cfff2":"#b9f4ff";ctx.lineWidth=evo?3:2;ctx.shadowBlur=evo?12:8;ctx.shadowColor="#64e7ff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.stroke();ctx.restore();
    drawPixelProjectile(key,s.x,s.y,Math.min(58,Math.max(30,s.r*1.25)),s.rot,.92);return;
  }
  legacyDrawCarrotBubbleGuard(s);
};
const legacyActivateSkillPolish=activateSkill;
activateSkill=function(){
  if(selectedCharacter==="tuntun"&&skillCooldown<=0&&typeof relicOwned==="function"&&relicOwned("vacuumCry")){skillMaxCooldown=(characterDefs.find(c=>c.id==="tuntun")?.cd||10)+5;legacyActivateSkillPolish();for(const e of enemies){if(e.dead||e.boss)continue;const a=Math.atan2(e.y-player.y,e.x-player.x),force=2400;e.kx=Math.cos(a)*force;e.ky=Math.sin(a)*force;hitEnemy(e,12,"squeal");}return;}
  legacyActivateSkillPolish();
};
const legacyDrawSwing=drawSwing;
drawSwing=function(s){
  if(!s.silverWave)return legacyDrawSwing(s);
  const k=s.life/s.maxLife,progress=1-k,bladeAngle=s.angle-1.22+progress*2.44;
  ctx.save();ctx.translate(s.x,s.y);
  const reach=Math.min(128,s.radius*.42);
  drawPixelProjectile("carrotGreatsword",Math.cos(bladeAngle)*reach,Math.sin(bladeAngle)*reach,168,bladeAngle,k);
  for(let i=0;i<5;i++){
    const a=s.angle-1.4+(i/17)*2.8,r=s.radius*(.45+.5*((i*7)%17)/17);
    ctx.globalAlpha=k*.82;ctx.fillStyle=i%3?"#dce8f2":"#ffffff";
    const q=3+(i%3)*2;ctx.fillRect(Math.round(Math.cos(a)*r),Math.round(Math.sin(a)*r),q,q);
  }
  ctx.restore();
};

const legacyHitEnemy=hitEnemy;
hitEnemy=function(e,dmg,source=null){
  legacyHitEnemy(e,dmg,source);
  if(source!=="carrotClub")return;
  shake=Math.max(shake,e.boss?7:4.5);
  spawnSpriteFx("weaponHit",e.x,e.y,Math.max(62,e.r*3.2),{alpha:.96,rot:Math.random()*Math.PI*2,driftY:-8});
  for(let i=0;i<10;i++){const a=i*Math.PI/5+(Math.random()-.5)*.2;particles.push({x:e.x,y:e.y,vx:Math.cos(a)*(100+Math.random()*120),vy:Math.sin(a)*(100+Math.random()*120),life:.28,r:3+(i%3),color:i%2?"#eef6ff":"#ffb347",pixel:true});}
};

const legacyHitEnemyChestPolish=hitEnemy;
hitEnemy=function(e,dmg,source=null){const before=chests.length,result=legacyHitEnemyChestPolish(e,dmg,source);if(chests.length>before){const c=chests[chests.length-1];c.kind=e.finalBoss?"final":e.boss?"boss":"elite";c.tier=e.bossTier||1;}return result;};
function rareShot(s){
  if(!s)return false;
  if(typeof s.kind==="string"&&s.kind.endsWith("Evolved"))return true;
  return s.kind==="rocket"||(s.kind==="seed"&&evolved.seed)||(s.kind==="acorn"&&evolved.acorn)||(s.kind==="bubble"&&evolved.bubble);
}
function drawRareWeaponAura(x,y,r=32){
  ctx.save();ctx.translate(x,y);ctx.globalCompositeOperation="screen";
  const pulse=1+Math.sin(elapsed*10)*.1;ctx.strokeStyle="rgba(226,242,255,.86)";ctx.lineWidth=3;ctx.shadowBlur=12;ctx.shadowColor="#c7e7ff";ctx.beginPath();ctx.arc(0,0,r*pulse,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<4;i++){const a=elapsed*2.6+i*Math.PI/2,rr=r*(.88+(i%2)*.22),q=i%2?3:5;ctx.fillStyle=i%2?"#a9d4f3":"#ffffff";ctx.fillRect(Math.round(Math.cos(a)*rr-q/2),Math.round(Math.sin(a)*rr-q/2),q,q);}
  ctx.restore();
}
const legacyDrawCarrotPolish=drawCarrot;
drawCarrot=function(s){legacyDrawCarrotPolish(s);if(rareShot(s))drawRareWeaponAura(s.x,s.y,Math.max(25,(s.r||9)*2.45));};

const legacySafeDrawWeaponFxPolish=safeDrawWeaponFx;
safeDrawWeaponFx=function(f){legacySafeDrawWeaponFxPolish(f);if(f&&f.evo)drawRareWeaponAura(f.x,f.y,Math.max(30,(f.r||f.radius||42)*.62));};

// Boss projectiles are deliberately larger and shape-coded instead of being recolored copies.
const legacyDrawEnemyOrbPolish=drawEnemyOrb;
drawEnemyOrb=function(o){
  if(!o.style||o.silk)return legacyDrawEnemyOrbPolish(o);
  const a=Math.atan2(o.vy,o.vx),r=Math.max(18,o.r*1.55),style=o.style;ctx.save();ctx.translate(o.x,o.y);ctx.rotate(a);ctx.imageSmoothingEnabled=false;ctx.shadowBlur=16;
  const colors={owl:["#fff1ad","#d18b3d"],mole:["#d7b174","#69432d"],mantis:["#e4ff82","#4e9c3f"],snake:["#b8ff74","#4c8c35"],spider:["#f0ddff","#8b57ac"],wildcat:["#ff8059","#ffd66b"],fox:["#ff9f42","#fff0a0"],toyBot:["#73e7ff","#7554ee"]}[style]||["#9deaff","#5366cf"];
  ctx.shadowColor=colors[0];ctx.strokeStyle=colors[0];ctx.fillStyle=colors[1];ctx.lineWidth=3;
  if(style==="owl"){ctx.beginPath();ctx.moveTo(r*1.5,0);ctx.lineTo(r*.35,-r*.82);ctx.lineTo(-r*.8,-r*.35);ctx.lineTo(-r*.35,0);ctx.lineTo(-r*.8,r*.35);ctx.lineTo(r*.35,r*.82);ctx.closePath();ctx.fill();ctx.stroke();ctx.strokeStyle="#fff";ctx.beginPath();ctx.moveTo(-r*.5,-r*.35);ctx.lineTo(r*.7,0);ctx.lineTo(-r*.5,r*.35);ctx.stroke();}
  else if(style==="mole"){for(const q of [[-.35,-.35,.7],[.4,.22,.48],[-.55,.48,.36]]){ctx.beginPath();ctx.arc(q[0]*r,q[1]*r,r*q[2],0,Math.PI*2);ctx.fill();ctx.stroke();}}
  else if(style==="mantis"){ctx.beginPath();ctx.arc(0,0,r*.72,-1.4,1.1);ctx.stroke();ctx.beginPath();ctx.arc(r*.2,0,r*.52,-1.05,1.5);ctx.stroke();}
  else if(style==="snake"){ctx.beginPath();ctx.arc(0,0,r*.72,0,Math.PI*1.7);ctx.stroke();ctx.beginPath();ctx.arc(0,0,r*.32,Math.PI,Math.PI*2);ctx.stroke();}
  else if(style==="spider"){ctx.beginPath();ctx.arc(0,0,r*.62,0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){const q=i*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(q)*r*.4,Math.sin(q)*r*.4);ctx.lineTo(Math.cos(q)*r*1.35,Math.sin(q)*r*1.35);ctx.stroke();}}
  else if(style==="wildcat"){for(const q of [-.4,0,.4]){ctx.beginPath();ctx.moveTo(-r*.5,q*r);ctx.lineTo(r*1.2,(q-.35)*r);ctx.stroke();}}
  else if(style==="fox"){ctx.beginPath();ctx.moveTo(r*1.4,0);ctx.lineTo(r*.25,-r*.7);ctx.lineTo(-r*.75,-r*.25);ctx.lineTo(-r*.35,0);ctx.lineTo(-r*.75,r*.25);ctx.lineTo(r*.25,r*.7);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#fff7ba";ctx.fillRect(-r*.1,-3,r*.6,6);}
  else{ctx.fillRect(-r*.55,-r*.55,r*1.1,r*1.1);ctx.strokeRect(-r*.55,-r*.55,r*1.1,r*1.1);ctx.fillStyle="#fff";ctx.fillRect(r*.05,-3,r*.65,6);}
  ctx.restore();
};

const heavy=characterDefs.find(c=>c.id==="chinchilla");
if(heavy){heavy.starterName=tr("🥕 萝卜巨剑","🥕 CARROT GREATSWORD");heavy.desc=tr("挥舞厚重萝卜巨剑释放银白剑气，造成前方180度重击与击退；吃西瓜恢复最大生命的10%。","Swing a massive carrot greatsword, releasing a silver shockwave with a 180-degree heavy strike and knockback; watermelon restores 10% maximum health.");}
})();
