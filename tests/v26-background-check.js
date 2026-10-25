/* V26 background asset regression checks. Run: node tests/v26-background-check.js */
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const html=fs.readFileSync(path.join(root,'index.html'),'utf8');const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const asset=path.join(root,'assets','moonlit-gothic-background.png');
assert.ok(fs.existsSync(asset),'background image asset exists');assert.ok(fs.statSync(asset).size>100000,'background image is not empty');
assert.ok(html.includes("gothicBackground.src = './assets/moonlit-gothic-background.png'"),'game loads the new background');
assert.ok(html.includes('function drawProceduralBackground()')&&html.includes('function drawBackground()'),'fallback and new renderer exist');
assert.ok(html.includes('ctx.drawImage(gothicBackground'),'background is rendered to Canvas');
assert.ok(html.includes('camera/worldMax'),'background follows camera');
assert.ok(sw.includes('moonlit-keep-v26')&&sw.includes('./assets/moonlit-gothic-background.png'),'PWA cache includes new asset and version');
const script=html.match(/<script>([\s\S]*?)<\/script>/);assert.ok(script,'inline game script exists');
const tmp=path.join(require('node:os').tmpdir(),`moonlit-v26-${process.pid}.js`);fs.writeFileSync(tmp,script[1]);const {spawnSync}=require('node:child_process');const result=spawnSync(process.execPath,['--check',tmp],{encoding:'utf8'});fs.rmSync(tmp,{force:true});assert.equal(result.status,0,result.stderr);console.log('PASS V26 background asset, Canvas renderer, fallback, parallax, PWA cache and JS syntax');
