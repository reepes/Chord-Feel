import test from 'node:test'
import assert from 'node:assert/strict'
import { ROOT_KEYS, chordIntervals, generateProgression, noteNameForPc, varyProgression } from '../site/src/engine.js'

function seeded(seed){ let s=seed>>>0; return ()=>{s=(1664525*s+1013904223)>>>0; return s/4294967296} }
const base={key:'C',mode:'major',feel:'dreamy',length:4,adventure:40}

test('generates requested number of playable chords',()=>{
  const p=generateProgression({...base,rng:seeded(1)})
  assert.equal(p.length,4)
  p.forEach(c=>{ assert.ok(c.symbol.length>0); assert.ok(c.roman.length>0); assert.ok(chordIntervals(c).length>=3) })
})

test('supports every advertised key in major and minor',()=>{
  for(const key of ROOT_KEYS) for(const mode of ['major','minor']) assert.equal(generateProgression({...base,key,mode,rng:seeded(8)}).length,4)
})

test('locked chord positions survive variation',()=>{
  const p=generateProgression({...base,rng:seeded(2)})
  const v=varyProgression(p,{...base,rng:seeded(9)},[true,false,true,false])
  assert.deepEqual(v[0],p[0]); assert.deepEqual(v[2],p[2])
})

test('high-adventure dark feel produces borrowed harmony across sample set',()=>{
  let borrowed=0
  for(let seed=1;seed<=40;seed++) borrowed += generateProgression({...base,feel:'dark',length:8,adventure:100,rng:seeded(seed)}).filter(c=>c.borrowed).length
  assert.ok(borrowed>0)
})

test('flat keys use flat note spelling',()=>{
  assert.equal(noteNameForPc(1,'Db'),'Db'); assert.equal(noteNameForPc(10,'Bb'),'Bb'); assert.equal(noteNameForPc(6,'C'),'F#')
})

test('invalid lengths and keys are rejected',()=>{
  assert.throws(()=>generateProgression({...base,length:1}),/length/i)
  assert.throws(()=>generateProgression({...base,key:'H'}),/Unsupported key/)
})


test('adventure increases borrowed-chord frequency for the same feel',()=>{
  let safe=0, weird=0
  for(let seed=1;seed<=80;seed++){
    safe += generateProgression({...base,feel:'nostalgic',length:8,adventure:0,rng:seeded(seed)}).filter(c=>c.borrowed).length
    weird += generateProgression({...base,feel:'nostalgic',length:8,adventure:100,rng:seeded(seed)}).filter(c=>c.borrowed).length
  }
  assert.ok(weird>safe, `expected high adventure (${weird}) > safe (${safe})`)
})
