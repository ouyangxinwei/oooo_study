// Canvas renderer isolated from simulation and persistence.
(function(global){
 function createRenderer(state){
  const game=state;
function rect(x,y,w,h,c){game.ctx.fillStyle=c;game.ctx.fillRect(Math.round(x),Math.round(y),w,h)}
function text(t,x,y,c='#f5f1dc',size=8){game.ctx.fillStyle=c;game.ctx.font=`bold ${size}px monospace`;game.ctx.fillText(t,Math.round(x),Math.round(y))}
function drawProceduralBackground(){
 const area=game.getCastleArea();
 rect(0,0,game.W,game.H,area.sky);
 // Moonlight and stars vary subtly by room.
 rect(365-game.camera*.04,24,30,30,'#d5d8ed');rect(372-game.camera*.04,18,30,30,area.sky);
 for(let i=0;i<38;i++){let x=((i*71-game.camera*.18)%game.W+game.W)%game.W,y=(i*37)%112;rect(x,y,1,1,i%4?'#9ba9d4':area.accent)}
 // Repeating castle silhouettes are tinted to match each room.
 for(let i=0;i<8;i++){let x=((i*100-game.camera*.28)%600+600)%600-40;rect(x,82,60,110,area.wall);rect(x+8,66,10,24,area.arch);rect(x+38,58,12,32,area.arch);rect(x+25,101,10,18,area.sky)}
 for(let i=0;i<6;i++){let x=((i*115-game.camera*.48)%600+600)%600-30;rect(x,137,55,60,area.arch);rect(x+8,146,39,51,area.sky);rect(x+13,151,29,46,area.wall)}
 // Room-specific silhouettes: graves, bookshelves, clock gears, or the royal gate.
 if(area.id==='catacombs'){
  for(let i=0;i<5;i++){const x=((i*105-game.camera*.38)%game.W+game.W)%game.W;rect(x,165,19,30,'#303148');rect(x+4,157,11,8,'#45435f');rect(x+8,169,3,10,'#7fc9c2');rect(x+6,172,7,3,'#7fc9c2')}
 }else if(area.id==='library'){
  for(let i=0;i<4;i++){const x=((i*128-game.camera*.4)%game.W+game.W)%game.W;rect(x,104,42,90,'#3a2c4a');for(let j=0;j<5;j++)rect(x+4+j*7,116+(j%2)*3,4,67,['#c58b72','#7e9bba','#d7b86e','#9d83c5','#78b6a1'][j])}
 }else if(area.id==='clocktower'){
  for(let i=0;i<3;i++){const x=((i*170-game.camera*.35)%game.W+game.W)%game.W;game.ctx.strokeStyle='#8b7891';game.ctx.lineWidth=2;game.ctx.beginPath();game.ctx.arc(x+20,116,16,0,Math.PI*2);game.ctx.stroke();rect(x+19,104,2,13,'#ffbd78');rect(x+20,115,9,2,'#ffbd78');rect(x+3,145,34,4,'#4b526c')}
 }else if(area.id==='gatehouse'){
  const x=220-game.camera*.22;rect(x,83,62,112,'#40283f');rect(x+8,94,46,101,'#190f24');rect(x+18,111,26,84,'#613c59');rect(x+28,126,6,69,'#f6ce76')
 }else if(area.id==='secret'){
  for(let i=0;i<5;i++){const x=((i*92-game.camera*.34)%game.W+game.W)%game.W;rect(x,110,30,84,'#17414c');rect(x+5,119,20,75,'#0b2635');rect(x+9,135,12,2,'#7cf4df');rect(x+14,128,2,16,'#7cf4df')}
  rect(250-game.camera*.2,70,70,3,'#7cf4df');rect(265-game.camera*.2,58,40,3,'#7cf4df');
 }else{
  for(let i=0;i<3;i++){const x=((i*180-game.camera*.3)%game.W+game.W)%game.W;rect(x,92,6,76,'#493e5e');rect(x+7,92,6,76,'#493e5e');rect(x-2,90,17,5,'#b7a36e');rect(x+3,108,5,21,'#6f86b9')}
 }
 // Tall threshold arches mark the entrance/exit of every named room.
 game.castleAreas.slice(1).forEach(a=>{const x=a.start-game.camera;if(x>-42&&x<game.W+42){rect(x-5,105,10,121,'#514762');rect(x-2,117,4,109,'#17182e');rect(x-13,102,26,7,a.accent);rect(x-8,94,16,8,a.arch)}});
}
function drawBackground(){
 drawProceduralBackground();
 const tint=['rgba(5,18,52,.18)','rgba(9,36,29,.30)','rgba(43,12,54,.28)','rgba(64,19,28,.28)','rgba(4,46,66,.32)','rgba(12,50,24,.30)','rgba(43,14,68,.33)','rgba(68,10,35,.36)'][game.currentStage-1]||'rgba(5,12,32,.10)';
 rect(0,0,game.W,game.H,tint);
 const sp=game.stageProfile();
 text(sp.title,game.W-142,15,sp.accent,7);
 drawStageMotif();
}
function drawStageMotif(){
 const a=game.stageProfile().accent;
 if(game.currentStage===1){rect(375-game.camera*.04,28,22,22,'#dce9ff');rect(383-game.camera*.04,24,22,22,game.stageProfile().sky);}
 else if(game.currentStage===2){for(let i=0;i<5;i++){const x=((i*91-game.camera*.25)%game.W+game.W)%game.W;rect(x,155,14,35,'#30374d');rect(x+3,148,8,8,a);rect(x+6,162,3,11,'#0a1025')}}
 else if(game.currentStage===3){for(let i=0;i<4;i++){const x=((i*125-game.camera*.22)%game.W+game.W)%game.W;rect(x,96,30,91,'#332546');for(let j=0;j<4;j++)rect(x+4+j*6,110+(j%2)*5,3,67,a)}}
 else if(game.currentStage===4){for(let i=0;i<3;i++){const x=((i*170-game.camera*.2)%game.W+game.W)%game.W;game.ctx.strokeStyle=a;game.ctx.lineWidth=2;game.ctx.beginPath();game.ctx.arc(x+20,122,17,0,Math.PI*2);game.ctx.stroke();rect(x+19,107,2,15,a);rect(x+20,121,11,2,a)}}
 else if(game.currentStage===5){for(let i=0;i<6;i++){const x=((i*87-game.camera*.28)%game.W+game.W)%game.W;rect(x,151,5,35,a);rect(x+4,138+(i%3)*4,5,48,a);rect(x+8,160,3,26,'#d9ffff')}}
 else if(game.currentStage===6){for(let i=0;i<6;i++){const x=((i*85-game.camera*.2)%game.W+game.W)%game.W;rect(x,94,3,90,a);rect(x+3,117+(i%3)*7,16,3,a);rect(x+12,130,3,24,a)}}
 else if(game.currentStage===7){game.ctx.strokeStyle=a;game.ctx.lineWidth=2;for(let i=0;i<4;i++){game.ctx.beginPath();game.ctx.moveTo(70+i*100-game.camera*.18,80);game.ctx.lineTo(100+i*100-game.camera*.18,190);game.ctx.lineTo(130+i*100-game.camera*.18,80);game.ctx.stroke()}}
 else {rect(190-game.camera*.2,95,100,92,'#30152b');rect(205-game.camera*.2,80,70,18,a);rect(216-game.camera*.2,68,12,12,a);rect(252-game.camera*.2,68,12,12,a);rect(225-game.camera*.2,111,30,55,'#7d365a');}
}
function drawPlatform(p){
 const x=p.x-game.camera;if(x+p.w<0||x>game.W)return;
 rect(x,p.y,p.w,game.H-p.y,'#33324b');rect(x,p.y,p.w,4,'#b7a36e');
 for(let xx=0;xx<p.w;xx+=16){rect(x+xx,p.y+8,1,Math.max(0,game.H-p.y-8),'#45425d');rect(x+xx+5,p.y+17,7,1,'#242a43')}
}

function drawStageMechanics(){for(const hazard of game.stageHazards){const x=hazard.x-game.camera;if(x+hazard.w<0||x>game.W)continue;const active=game.isHazardActive(hazard),color=!active?'#596071':hazard.type==='ice'?'#8df5ff':hazard.type==='vines'?'#a7f38b':hazard.type==='rift'?'#d5a2ff':hazard.type==='flame'?'#ff9b62':hazard.type==='pendulum'?'#ffbd78':'#ff687a';rect(x,220,hazard.w,6,active?color+'88':'#45425d');for(let xx=0;xx<hazard.w;xx+=8){if(hazard.type==='spikes'||hazard.type==='ice'){game.ctx.fillStyle=color;game.ctx.beginPath();game.ctx.moveTo(x+xx,220);game.ctx.lineTo(x+xx+4,210);game.ctx.lineTo(x+xx+8,220);game.ctx.fill()}else if(hazard.type==='vines'){rect(x+xx,212,3,10,color);rect(x+xx+3,216,4,2,color)}else{rect(x+xx+2,active?210+Math.floor((game.tick+xx)*2%5):216,4,10,color)}}}
 for(const sw of game.stageSwitches){const x=sw.x-game.camera,active=game.activatedSwitches.has(game.stageSwitchKey(sw));if(x<-20||x>game.W+20)continue;rect(x-7,sw.y+8,14,4,'#6d5267');rect(x-2,sw.y,4,11,active?'#8df5ff':'#c7b6a5');rect(x-6,sw.y-3,12,4,active?'#8df5ff':'#ffbd78');if(Math.abs(game.player.x+game.player.w/2-sw.x)<60)text((active?'✓ ':'E ')+sw.name,x-42,sw.y-8,active?'#8df5ff':'#ffe7a0',6)}
 if(game.stageObjective&&!game.collectedObjectives.has(game.stageObjective.key)){const x=game.stageObjective.x-game.camera,y=game.stageObjective.y,bob=Math.sin(game.tick*4)*2;if(x>-24&&x<game.W+24){rect(x+5,y+bob-4,6,28,'#7cf4df55');rect(x+2,y+bob,12,16,game.stageProfile().accent);rect(x+5,y+bob+3,6,10,'#eefcff');if(Math.abs(game.player.x+game.player.w/2-game.stageObjective.x)<72)text('探索：'+game.stageObjective.name,x-38,y-8,game.stageProfile().accent,6)}}}
const pixelPalettes={
 hero:{H:'#3a2438',S:'#e8c6a1',E:'#20233b',C:'#d8dbe4',M:'#35547b',R:'#8f2949',r:'#c34c68',L:'#aeb9d1',B:'#80604f',G:'#f6ce76'},
 bat:{P:'#574c86',p:'#8270bb',E:'#ff687a',W:'#7665ad',w:'#d6c8f1'},
 skeleton:{B:'#dad6c7',b:'#a8a391',E:'#25263b',T:'#786b65',A:'#737c92',W:'#b9b4a2'},
 mage:{H:'#453b78',h:'#7664b9',R:'#574b91',E:'#8bd9ff',S:'#c5b5eb',B:'#302c58'},
 knight:{S:'#b8c3d5',s:'#77839f',E:'#ffcf77',A:'#5e6b87',a:'#d0d8e7',B:'#707b95',W:'#b9c5d8'}
};
const pixelSprites={
 hero:['..HHHH..','.HHHHHH.','.HSSSS..','.HSSESS..','..SSSS..','...S....','..CCCCC.','R.CCCM..','RRCCMM..','.CCMMMC.','.LL.LL..','.LL.LL..','LL...LL.','BB...BB.'],
 bat:['....PP....','..PPPPPP..','.PPpPPpPP.','PPpPPPPpPP','PpPPPEPPpP','..PPPPPP..','...PppP...','..game.W....game.W..','.WW....WW.','WW......WW','..w....w..','...w..w...'],
 skeleton:['....BBBB....','...BBBBBB...','...BBEEBB...','...BBBBBB...','....BbbB....','.....BB......','...AABBAA....','..AAABBAAA...','..AABBBBBA...','...AABBBA....','...BB..BB....','...BB..BB....','...BB..BB....','..BBB..BBB...'],
 mage:['....HHHH....','...HHHHHH...','..HHHHHHHH..','...HE..EH....','....EEEE....','.....EE......','...RRRRRR....','..RRRRRRRR...','..RRRERRRR...','...RRRRRR....','...BB..BB....','...BB..BB....','...BB..BB....','..BBB..BBB...'],
 knight:['...SSSSSS....','..SSSSSSSS...','..ssEEEEss...','...SSSSSS....','...AAAAAA....','..AAAAAAAA...','..AAaAAaAA...','..AAAAAAAA...','..AAAAWAAA...','...AAAAAA....','..SS....SS...','..SS....SS...','..SS....SS...','..BBB..BBB...']
};
function expandPixelGrid(rows,factor=6){const width=Math.max(...rows.map(row=>row.length));return rows.flatMap(row=>{const expanded=[...row.padEnd(width,'.')].flatMap(ch=>Array(factor).fill(ch)).join('');return Array(factor).fill(expanded)})}
const pixelSpritesMax=Object.fromEntries(Object.entries(pixelSprites).map(([name,rows])=>[name,expandPixelGrid(rows,6)]));
function drawPixelSprite(rows,x,y,palette,scale=2,flip=false){game.ctx.save();const width=Math.max(...rows.map(row=>row.length));rows=rows.map(row=>row.padEnd(width,'.'));if(flip){game.ctx.translate(x+width*scale,y);game.ctx.scale(-1,1);x=0;y=0}for(let row=0;row<rows.length;row++){for(let col=0;col<rows[row].length;col++){const color=palette[rows[row][col]];if(color)rect(x+col*scale,y+row*scale,scale,scale,color)}}game.ctx.restore()}
function drawHero(){
 const worldX=game.player.x-game.camera,worldY=game.player.y,state=game.player.animState,phase=game.player.anim*12;
 const crouch=state==='crouch'||(state==='attack'&&game.player.attackStyle==='crouch');
 const hurt=state==='hurt'||(game.player.invuln>0&&Math.floor(game.tick*18)%2===0);
 const drawX=worldX+game.player.w/2-24, feet=worldY+game.player.h;
 const bob=state==='run'?Math.abs(Math.sin(phase*1.35))*2:state==='jump'?-2:state==='fall'?2:state==='idle'?Math.sin(phase*.45):0;
 if(hurt)game.ctx.globalAlpha=.58;
 let rows=pixelSpritesMax.hero,drawY=feet-84+bob;
 if(crouch){rows=expandPixelGrid(['........','........','........','........','........','........','........','RRCCMM..','.CCMMMC.','.LL.LL..','LL...LL.','BB...BB.'],6);drawY=feet-72}
 if(state==='dead'){game.ctx.save();game.ctx.translate(worldX+game.player.w/2,worldY+game.player.h/2);game.ctx.rotate(game.player.face===1?.9:-.9);drawPixelSprite(rows,-24,-(crouch?36:42),pixelPalettes.hero,1,game.player.face<0);game.ctx.restore();game.ctx.globalAlpha=1;return}
 drawPixelSprite(rows,drawX,drawY,pixelPalettes.hero,1,game.player.face<0);
 // Pixel-scale attack effects with the enlarged sprite. Combat hitboxes remain at gameplay scale.
 if(game.player.attackT>0){const progress=1-game.player.attackT/game.player.attackDuration,reach=game.player.attackRange,sx=worldX+game.player.w/2+game.player.face*20,sy=feet-(game.player.attackStyle==='crouch'?22:48)+bob*3;let ex=sx+game.player.face*(progress<.28?27:progress<.68?reach*1.7:reach*1.3),ey=sy+(progress<.28?-21:progress<.68?-6:15);game.ctx.strokeStyle='#f6ce76';game.ctx.lineWidth=6;game.ctx.beginPath();game.ctx.moveTo(sx,sy);game.ctx.quadraticCurveTo(sx+game.player.face*reach*1.2,sy-15,ex,ey);game.ctx.stroke();rect(ex-3,ey-3,9,9,'#fff0b0')}
 if(state==='hang'){const handX=worldX+(game.player.hangSide==='left'?game.player.w-3:0);rect(handX,worldY+4,12,9,'#e8c6a1')}
 if(game.player.magicT>0){rect(drawX-6,drawY-6,60,96,'#7b9cff33');rect(drawX+21,drawY+9,12,6,'#b7d7ff')}
 game.ctx.globalAlpha=1;
}
function drawEnemy(e){
 const x=e.x-game.camera,y=e.y;if(x<-95||x>game.W+95)return;
 if(e.hitFlash>0){game.ctx.globalAlpha=.55;e.hitFlash=Math.max(0,e.hitFlash-.025)}
 const rows=pixelSpritesMax[e.kind],width=rows?rows[0].length:0,height=rows?rows.length:0,spriteY=y+e.h-height;
 if(rows)drawPixelSprite(rows,x+e.w/2-width/2,spriteY,pixelPalettes[e.kind],1,e.vx<0);
 if(e.kind==='bat'){const flap=Math.sin(game.tick*18+e.phase)>0?6:0;rect(x-flap,y+e.h/2,12,18,'#7665ad');rect(x+e.w+flap-12,y+e.h/2,12,18,'#7665ad')}
 if(e.kind==='knight')rect(x+e.w-9,y+e.h*.42,9,e.h*.5,'#b9c5d8');
 const barW=width,barX=x+e.w/2-barW/2,barY=spriteY-10;rect(barX,barY,barW,6,'#383b51');rect(barX,barY,barW*Math.max(0,e.hp/e.max),6,'#ff687a');
 if(e.state==='chase')text('!',x+e.w/2-4,barY-12,'#ffce79',12);
 game.ctx.globalAlpha=1;
}
function drawBoss(){
 if(!game.bossSpawned||!game.boss.alive)return;
 let x=game.boss.x-game.camera,y=game.boss.y;if(x<-230||x>game.W+230)return;
 const sp=game.stageProfile(),c=sp.body,a=sp.accent,flash=game.boss.flash?'#fff2c9':c;
 const artTop=[-3,-6,-12,-8,-4,-8,-5,2][game.currentStage-1],artBottom=[47,54,47,37,43,45,48,48][game.currentStage-1];
 const baseX=x,baseY=y;game.ctx.save();game.ctx.translate(x+game.boss.w/2,y+game.boss.h);game.ctx.scale(3,3);x=-game.boss.w/2;y=-artBottom;
 // Each chapter has a distinct silhouette, palette and readable pixel-art ornament.
 if(game.currentStage===1){rect(x+7,y+7,24,40,flash);rect(x+3,y+2,32,15,flash);rect(x+7,y-3,6,8,a);rect(x+25,y-3,6,8,a);rect(x+10,y+10,5,4,'#ffcf77');rect(x+24,y+10,5,4,'#ffcf77');rect(x+2,y+22,8,17,c);rect(x+28,y+22,8,17,c)}
 else if(game.currentStage===2){rect(x+8,y+10,24,37,flash);rect(x+4,y+1,30,13,flash);rect(x+1,y-6,9,15,a);rect(x+28,y-6,9,15,a);rect(x+12,y+14,4,4,'#c9ffe5');rect(x+23,y+14,4,4,'#c9ffe5');rect(x-5,y+18,10,22,c);rect(x+33,y+18,10,22,c);rect(x+12,y+44,5,10,'#d7e3df');rect(x+23,y+44,5,10,'#d7e3df')}
 else if(game.currentStage===3){rect(x+9,y+12,22,35,flash);rect(x+5,y+3,30,14,flash);rect(x+2,y-7,35,6,a);rect(x+9,y-12,7,8,a);rect(x+25,y-12,7,8,a);rect(x+12,y+13,4,4,a);rect(x+23,y+13,4,4,a);rect(x+1,y+22,8,18,c);rect(x+31,y+22,8,18,c);rect(x+15,y+25,10,14,'#30214e')}
 else if(game.currentStage===4){rect(x+5,y+8,30,39,flash);rect(x+2,y+1,36,15,flash);rect(x+8,y-8,6,10,a);rect(x+25,y-8,6,10,a);rect(x+12,y+12,5,5,'#fff0a6');rect(x+24,y+12,5,5,'#fff0a6');rect(x-4,y+20,9,17,c);rect(x+35,y+20,9,17,c);rect(x+14,y+29,12,7,'#4b1d32')}
 else if(game.currentStage===5){rect(x+4,y+10,40,40,flash);rect(x+1,y+4,46,12,flash);rect(x+7,y-4,8,10,a);rect(x+33,y-4,8,10,a);rect(x+12,y+15,6,5,'#e4ffff');rect(x+29,y+15,6,5,'#e4ffff');rect(x-5,y+20,10,23,a);rect(x+43,y+20,10,23,a);rect(x+18,y+29,12,13,'#183b55')}
 else if(game.currentStage===6){rect(x+7,y+10,26,38,flash);rect(x+4,y+3,32,12,flash);rect(x+5,y-8,5,15,a);rect(x+30,y-8,5,15,a);rect(x+12,y+13,5,4,'#d8ffae');rect(x+24,y+13,5,4,'#d8ffae');for(let k=0;k<4;k++)rect(x-5+k*12,y+23+(k%2)*5,5,17,a);rect(x+12,y+31,15,5,'#24533b')}
 else if(game.currentStage===7){rect(x+7,y+9,28,39,flash);rect(x+3,y+1,36,14,flash);rect(x-7,y+4,11,26,a);rect(x+38,y+4,11,26,'#a76dff');rect(x+11,y+13,5,5,'#f8e7ff');rect(x+25,y+13,5,5,'#a5f4ff');rect(x+12,y+29,16,7,'#20143d');rect(x+10,y-5,6,7,a);rect(x+27,y-5,6,7,'#a76dff')}
 else {rect(x+7,y+17,39,31,flash);rect(x+4,y+8,43,18,flash);rect(x+3,y+2,13,12,a);rect(x+33,y+2,13,12,a);rect(x+10,y+13,7,5,'#fff5c4');rect(x+31,y+13,7,5,'#fff5c4');rect(x-8,y+23,15,9,c);rect(x+43,y+23,15,9,c);rect(x+13,y+29,25,6,'#501c42');rect(x+18,y+36,5,12,'#f6ce76');rect(x+31,y+36,5,12,'#f6ce76')}
 game.ctx.restore();x=baseX;y=baseY;
 const barY=baseY+game.boss.h-(artBottom-artTop)*3-14,barX=baseX-game.boss.w;rect(barX,barY,game.boss.w*3,7,'#383b51');rect(barX,barY,game.boss.w*3*Math.max(0,game.boss.hp/game.boss.max),7,a);
 const labels=['灵弹 / 冲刺','镰刀突进','三重奥术弹','地裂冲击波','冰晶弹幕','荆棘缠绕','裂隙追踪弹','月蚀连击'];text(labels[game.currentStage-1],baseX+game.boss.w/2-44,barY-14,a,11);
}
function drawWorld(){
 drawBackground();
 game.platforms.forEach(drawPlatform);
 drawStageMechanics();
 // Secret doors shimmer when nearby; the hidden sanctum is a real traversable extension of the world.
 game.secretPassages.forEach(portal=>{const x=portal.x-game.camera;if(x>-35&&x<game.W+35){rect(x-9,155,18,71,'#174d58');rect(x-5,161,10,65,'#286b70');rect(x-2,169,4,54,'#7cf4df');rect(x-12,151,24,5,'#b8fff2');if(Math.abs((game.player.x+game.player.w/2)-(portal.x+2))<42)text(portal.kind==='entrance'?'↑ 发现秘密通道':'↑ 返回古堡',x-29,143,'#b8fff2',7)}});
 // Treasure game.chests and collectible rewards.
 game.chests.forEach(c=>{const x=c.x-game.camera;if(x<-30||x>game.W+30)return;rect(x,c.y+5,c.w,c.h-5,c.open?'#5c4938':'#8a5a37');rect(x-1,c.y+2,c.w+2,7,c.open?'#6e5948':'#d49a4d');rect(x+7,c.y+7,4,5,'#f6ce76');if(!c.open)rect(x+7,c.y-1,4,4,'#ffe7a0');if(!c.open&&Math.abs((game.player.x+game.player.w/2)-(c.x+c.w/2))<30)text('↑ 开宝箱',x-8,c.y-7,'#ffe7a0',7)});
 game.pickups.forEach(p=>{const x=p.x-game.camera;if(x<-20||x>game.W+20)return;const bob=Math.sin(game.tick*5+p.phase)*2;const color=p.type==='gold'?'#f6ce76':p.type==='hp'?'#ff687a':p.type==='mp'?'#80caff':p.type==='silverWhip'||p.type==='moonBlade'?'#d7e4ff':p.type==='guardianArmor'||p.type==='travelerCloak'?'#aeb7d9':'#c59aff';rect(x,p.y+bob,8,8,color);rect(x+2,p.y+bob-2,4,12,color)});
 game.enemies.forEach(e=>{if(e.alive)drawEnemy(e)});
 drawBoss();drawHero();
 game.projectiles.forEach(p=>{const bounds=game.projectileBounds(p),x=p.x-game.camera;const hostile=p.hostile;const glow=hostile?(p.attackType==='high'?'#ffb56b':p.attackType==='mage'?'#c59aff':p.attackType==='crystal'?'#8df5ff':p.attackType==='vines'?'#a7f38b':p.attackType==='rift'?'#d5a2ff':p.attackType==='ultimate'?'#ffe7a4':'#8bd9ff'):'#8bd9ff';const core=hostile?(p.attackType==='high'?'#fff0a6':p.attackType==='mage'?'#f0d8ff':p.attackType==='crystal'?'#e5ffff':p.attackType==='vines'?'#e0ffc9':p.attackType==='rift'?'#f8e7ff':p.attackType==='ultimate'?'#fff9d2':'#d8f6ff'):'#d8f6ff';rect(x,bounds.y,bounds.w,bounds.h,glow);rect(x+6,bounds.y,12,27,core)});
 // V21 room title and subtitle follow the game.player's actual world position.
 const area=game.getCastleArea();text(area.en,12,15,area.accent,8);text(area.name+' · '+area.detail,12,27,'#d8def5',6);if(area.id==='secret')text('秘密区域已发现 · 额外宝箱与月光遗物',12,39,'#7cf4df',7);
 if(game.bossSpawned&&game.boss.alive&&Math.abs(game.player.x-game.boss.x)<300){text('GATEKEEPER',game.W-86,15,'#ff9aaa',8);text('高位橙弹：跳跃  /  低位蓝弹：下蹲',game.W-190,27,game.boss.attackType==='high'?'#ffbd78':'#8bd9ff',7)}
}
  function draw(){game.ctx.clearRect(0,0,game.W,game.H);drawWorld();if(game.player.invuln>0&&Math.floor(game.tick*12)%2===0)rect(game.player.x-game.camera+game.player.w/2-24,game.player.y+game.player.h-84,48,84,'#ffffff55')}
  return Object.freeze({draw});
 }
 global.MoonlitRenderer=Object.freeze({create:createRenderer});
})(window);
