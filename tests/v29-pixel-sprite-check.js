/* V29 original pixel sprite regression checks. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),renderer=fs.readFileSync(path.join(root,'renderer.js'),'utf8'),sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
for(const name of ['hero','bat','skeleton','mage','knight'])assert.ok(renderer.includes(name+':['),'missing pixel sprite '+name);
assert.match(renderer,/function drawPixelSprite\(/,'pixel sprite renderer');assert.ok(renderer.includes('rows=pixelSpritesMax.hero')&&renderer.includes('drawPixelSprite(rows,drawX,drawY'),'hero uses high-resolution pixel sprite');assert.match(renderer,/drawPixelSprite\(rows,x/,'enemies use pixel sprites');
assert.ok(renderer.includes('function drawBoss()'),'boss rendering preserved');assert.match(sw,/moonlit-keep-v42/,'cache version bumped');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1],tmp=path.join(require('os').tmpdir(),'moonlit-v29-'+process.pid+'.js');fs.writeFileSync(tmp,script);const result=require('child_process').spawnSync(process.execPath,['--check',tmp],{encoding:'utf8'});fs.rmSync(tmp,{force:true});assert.equal(result.status,0,result.stderr);
console.log('PASS V29 original hero and enemy pixel sprites, Boss preservation, cache and embedded JavaScript syntax');
