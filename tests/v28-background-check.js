/* V28 procedural background and packaging regression checks. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8'),renderer=fs.readFileSync(path.join(root,'renderer.js'),'utf8'),source=html+'\n'+renderer,sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
assert.ok(!fs.existsSync(path.join(root,'assets','moonlit-gothic-background.png')),'removed background image');
assert.ok(!html.includes('gothicBackground')&&!html.includes('moonlit-gothic-background.png'),'no image background dependency');
assert.match(source,/function drawProceduralBackground\(\)/,'procedural renderer remains');
assert.match(renderer,/function drawBackground\(\)\{\s*drawProceduralBackground\(\);/,'main background uses procedural renderer');
assert.ok(!/function drawBackground\([\s\S]*?drawImage\(/.test(renderer),'background does not draw a bitmap');
assert.match(sw,/moonlit-keep-v42/,'cache version bumped');
assert.ok(!sw.includes('moonlit-gothic-background.png')&&!sw.includes('moonlit-keep-v27'),'old asset and cache removed');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const tmp=path.join(require('os').tmpdir(),'moonlit-v28-'+process.pid+'.js');fs.writeFileSync(tmp,script);const result=require('child_process').spawnSync(process.execPath,['--check',tmp],{encoding:'utf8'});fs.rmSync(tmp,{force:true});assert.equal(result.status,0,result.stderr);
console.log('PASS V28 procedural background, deleted asset, cache invalidation and embedded JavaScript syntax');
