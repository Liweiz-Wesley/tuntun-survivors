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
  drawSilverSlashWave(s.angle,s.radius,progress);
  const reach=Math.min(128,s.radius*.42);
  drawPixelProjectile("carrotGreatsword",Math.cos(bladeAngle)*reach,Math.sin(bladeAngle)*reach,168,bladeAngle,k);
  for(let i=0;i<18;i++){
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

const heavy=characterDefs.find(c=>c.id==="chinchilla");
if(heavy){heavy.starterName=tr("🥕 萝卜巨剑","🥕 CARROT GREATSWORD");heavy.desc=tr("挥舞厚重萝卜巨剑释放银白剑气，造成前方180度重击与击退；吃西瓜恢复最大生命的10%。","Swing a massive carrot greatsword, releasing a silver shockwave with a 180-degree heavy strike and knockback; watermelon restores 10% maximum health.");}
})();
