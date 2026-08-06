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

// Keep the archer portrait and in-run sprite on the same cleaned, slingshot-themed source.
const legacyRenderCharacterSelect=renderCharacterSelect;
renderCharacterSelect=function(){legacyRenderCharacterSelect();const portrait=document.querySelector('.character-card [aria-label="弹弓豚鼠"],.character-card [aria-label="Archer Guinea Pig"]');if(portrait)portrait.style.backgroundImage="url('assets/generated/characters/archer-idle-clean.png')";};

// Character cards are rebuilt from the bilingual source; select the legacy archer image by its URL
// so the cleaned portrait is used regardless of localized aria-label encoding.
const legacyRenderCharacterSelectClean=renderCharacterSelect;
renderCharacterSelect=function(){legacyRenderCharacterSelectClean();const portrait=[...document.querySelectorAll('.character-portrait')].find(p=>p.style.backgroundImage.includes('archer-guinea.png'));if(portrait)portrait.style.backgroundImage="url('assets/generated/characters/archer-idle-clean.png')";};

// Food projectiles were overpowering the small 32px characters; halve only projectile art, not hitboxes.
const legacyDrawPixelProjectile=drawPixelProjectile;
drawPixelProjectile=function(key,x,y,size,rot=0,alpha=1){return legacyDrawPixelProjectile(key,x,y,String(key).startsWith("proj")?size*.5:size,rot,alpha);};

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
      return drawPixelFrameAt(rolling?"archerRollClean":"archerAttackClean",6,actionFrame,player.x,player.y+42,116,player.facing);
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
