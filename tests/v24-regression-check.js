/* V25 regression checks. Run: node tests/v25-regression-check.js */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/);
assert.ok(script, 'inline game script exists');
const checks = [
  ['versioned save key', html.includes("SAVE_KEY='moonlitKeepSaveV25'") && html.includes('SAVE_VERSION=25')],
  ['continue/new-game menu', html.includes('id="continueBtn"') && html.includes('id="startBtn"')],
  ['save lifecycle hooks', html.includes("addEventListener('pagehide'") && html.includes("addEventListener('visibilitychange'")],
  ['periodic autosave', html.includes('Date.now()-lastSaveAt>5000')],
  ['player progression persisted', /level:player\.level[\s\S]*?statPoints:player\.statPoints/.test(html)],
  ['inventory and chest progress persisted', html.includes('openedChests:[...inventory.openedChests]') && html.includes('hpPotions:inventory.hpPotions')],
  ['equipment persisted and validated', html.includes('const equipment={}') && html.includes('gearCatalog[id].slot===slot')],
  ['world/Boss state persisted', html.includes('boss:{x:boss.x') && html.includes('enemies:enemies.map')],
  ['hidden room and two-way secret passages', html.includes("id:'secret',name:'月影密室'") && html.includes('secretPassages') && html.includes('portal.target')],
  ['secret discovery and hidden chest persist', html.includes('discoveredSecrets:[...discoveredSecrets]') && html.includes('{x:1590,y:205') && html.includes("discoveredSecrets=new Set")],
  ['expanded world collision and camera bounds', html.includes('const worldWidth=1800') && html.includes('{x:1440,y:226,w:360}')],
  ['pickup removal precedes save', /for\(let i=pickups\.length-1;i>=0;i--\)if\(pickups\[i\]\.collected\)pickups\.splice\(i,1\);if\(collectedAny\)saveGame/.test(html)],
  ['service worker cache bumped', sw.includes('moonlit-keep-v25') && !sw.includes('moonlit-keep-v24')],
  ['docs updated', readme.includes('v0.25 更新：隐藏房间与秘密通道') && changelog.includes('v0.25 — 隐藏房间、秘密通道与可探索区域')],
];
for (const [name, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'} ${name}`);
  assert.ok(passed, name);
}
const tmp = path.join(require('node:os').tmpdir(), `moonlit-v24-inline-${process.pid}.js`);
fs.writeFileSync(tmp, script[1]);
const { spawnSync } = require('node:child_process');
const syntax = spawnSync(process.execPath, ['--check', tmp], { encoding: 'utf8' });
fs.rmSync(tmp, { force: true });
assert.equal(syntax.status, 0, `inline JS syntax check failed: ${syntax.stderr}`);
console.log('PASS inline JavaScript syntax');
console.log(`All ${checks.length + 1} V25 checks passed.`);
