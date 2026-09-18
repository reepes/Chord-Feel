import { FEEL_PRESETS } from './feel-presets.js'

const MAJOR_SCALE = [0,2,4,5,7,9,11]
const MINOR_SCALE = [0,2,3,5,7,8,10]
const MAJOR_QUALITIES = ['major','minor','minor','major','major','minor','diminished']
const MINOR_QUALITIES = ['minor','diminished','major','minor','minor','major','major']
const MAJOR_ROMANS = ['I','ii','iii','IV','V','vi','vii°']
const MINOR_ROMANS = ['i','ii°','III','iv','v','VI','VII']
const SHARP_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const FLAT_NAMES = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B']
const KEY_TO_PC = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11}
export const ROOT_KEYS = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B']

const BORROWED_MAJOR = [
  {id:'iv', semitone:5, degree:4, quality:'minor', roman:'iv'},
  {id:'bVII', semitone:10, degree:7, quality:'major', roman:'♭VII'},
  {id:'bVI', semitone:8, degree:6, quality:'major', roman:'♭VI'},
  {id:'bII', semitone:1, degree:2, quality:'major', roman:'♭II'},
  {id:'III', semitone:4, degree:3, quality:'major', roman:'III'}
]
const BORROWED_MINOR = [
  {id:'IV', semitone:5, degree:4, quality:'major', roman:'IV'},
  {id:'V', semitone:7, degree:5, quality:'major', roman:'V'},
  {id:'bII', semitone:1, degree:2, quality:'major', roman:'♭II'},
  {id:'I', semitone:0, degree:1, quality:'major', roman:'I'},
  {id:'III', semitone:4, degree:3, quality:'major', roman:'III'}
]

const clamp = (v,min,max)=>Math.max(min,Math.min(max,v))
const pc = v => ((v%12)+12)%12

export function noteNameForPc(pitchClass,key){
  const useFlats = key.includes('b') || ['F','Bb','Eb','Ab','Db','Gb'].includes(key)
  return (useFlats ? FLAT_NAMES : SHARP_NAMES)[pc(pitchClass)]
}

function diatonicCandidates(keyPc,mode){
  const scale = mode==='major' ? MAJOR_SCALE : MINOR_SCALE
  const qualities = mode==='major' ? MAJOR_QUALITIES : MINOR_QUALITIES
  const romans = mode==='major' ? MAJOR_ROMANS : MINOR_ROMANS
  return scale.map((offset,i)=>({id:`d${i+1}`,degree:i+1,rootPc:pc(keyPc+offset),quality:qualities[i],romanBase:romans[i],borrowed:false}))
}
function borrowedCandidates(keyPc,mode){
  return (mode==='major'?BORROWED_MAJOR:BORROWED_MINOR).map(item=>({
    id:`b-${item.id}`,degree:item.degree,rootPc:pc(keyPc+item.semitone),quality:item.quality,romanBase:item.roman,borrowed:true,borrowedId:item.id
  }))
}
function weightedPick(items,weights,rng){
  const safe = weights.map(w=>Math.max(.0001,w)); const total=safe.reduce((a,b)=>a+b,0); let roll=rng()*total
  for(let i=0;i<items.length;i++){ roll-=safe[i]; if(roll<=0) return items[i] }
  return items[items.length-1]
}
function commonToneScore(a,b){
  if(!a) return 1
  const intervals={major:[0,4,7],minor:[0,3,7],diminished:[0,3,6]}
  const at=intervals[a.quality].map(n=>pc(a.rootPc+n)); const bt=intervals[b.quality].map(n=>pc(b.rootPc+n))
  const common=bt.filter(n=>at.includes(n)).length
  return 1+common*.18
}
function candidateWeight(candidate,previous,index,length,options){
  const preset=FEEL_PRESETS[options.feel], adventure=clamp(options.adventure,0,100)/100
  let weight=preset.degreeWeights[candidate.degree]
  if(candidate.borrowed){
    weight *= (preset.borrowed[candidate.borrowedId] ?? .1) * (.08 + adventure*1.15)
  } else weight *= 1.15-adventure*.18
  if(previous){
    weight *= (!previous.borrowed && !candidate.borrowed) ? (preset.transitions[previous.degree][candidate.degree] ?? .78) : .92
    if(previous.rootPc===candidate.rootPc && previous.quality===candidate.quality) weight*=.06
    weight *= commonToneScore(previous,candidate) ** preset.voiceLeading
  }
  if(index===0){
    const startBias=.4+preset.dimensions.resolution/125
    if(candidate.degree===1 && !candidate.borrowed) weight*=.7+startBias
    if(candidate.degree===4 || candidate.degree===6) weight*=1.08
  }
  if(index===length-1){
    const resolution=preset.dimensions.resolution/100
    if(candidate.degree===1 && !candidate.borrowed) weight*=.65+resolution*1.9
    if(candidate.degree===5 && !candidate.borrowed) weight*=.65+preset.cadence
    if(resolution<.35 && candidate.degree===4) weight*=1.2
  }
  return Math.max(.0001,weight)
}

const symbolSuffix={triad:'',maj7:'maj7',min7:'m7',add9:'add9',maj9:'maj9',min9:'m9',sus2:'sus2',sus4:'sus4',dominant7:'7',diminished:'dim'}
const romanSuffix={triad:'',maj7:'maj7',min7:'7',add9:'add9',maj9:'maj9',min9:'9',sus2:'sus2',sus4:'sus4',dominant7:'7',diminished:''}
export function allowedColorsFor(candidate){
  if(candidate.quality==='diminished') return ['diminished']
  if(candidate.quality==='minor') return ['triad','min7','min9','add9']
  return ['triad','maj7','add9','maj9','sus2','sus4','dominant7']
}
function decorate(candidate,key,options,rng){
  const preset=FEEL_PRESETS[options.feel], adventure=clamp(options.adventure,0,100)/100
  const complexity=clamp((preset.dimensions.complexity+options.adventure*.22)/100,0,1)
  const allowed=allowedColorsFor(candidate)
  const weights=allowed.map(color=>{
    let w=preset.colors[color] ?? .2
    w *= color==='triad' ? 1.2-complexity*.65 : .45+complexity*.9
    if((color==='sus2'||color==='sus4') && preset.dimensions.openness>60) w*=1.2
    if(color==='dominant7' && candidate.degree!==5) w*=.3+adventure*.7
    if(color==='maj9'||color==='min9') w*=.5+complexity*.7
    return w
  })
  let color=weightedPick(allowed,weights,rng)
  if(candidate.quality==='major' && candidate.degree===5 && preset.dimensions.tension>55 && rng()<.45) color='dominant7'
  const root=noteNameForPc(candidate.rootPc,key)
  return {...candidate,root,color,symbol:`${root}${symbolSuffix[color]}`,roman:`${candidate.romanBase}${romanSuffix[color]}`}
}

export function generateProgression(options,locked=[]){
  const rng=options.rng ?? Math.random, keyPc=KEY_TO_PC[options.key]
  if(keyPc===undefined) throw new Error(`Unsupported key: ${options.key}`)
  if(options.length<2||options.length>16) throw new Error('Progression length must be between 2 and 16')
  if(!FEEL_PRESETS[options.feel]) throw new Error(`Unsupported feel: ${options.feel}`)
  const candidates=[...diatonicCandidates(keyPc,options.mode),...borrowedCandidates(keyPc,options.mode)]
  const out=[]
  for(let i=0;i<options.length;i++){
    if(locked[i]){ out.push(locked[i]); continue }
    const previous=out[i-1]
    const weights=candidates.map(c=>candidateWeight(c,previous,i,options.length,options))
    out.push(decorate(weightedPick(candidates,weights,rng),options.key,options,rng))
  }
  return out
}

export function varyProgression(progression,options,lockedFlags){
  const rng=options.rng ?? Math.random
  const locks=progression.map((c,i)=>lockedFlags[i]?c:null)
  const fresh=generateProgression({...options,rng},locks)
  return fresh.map((chord,i)=>{
    if(lockedFlags[i]) return progression[i]
    if(rng()<.35) return decorate(progression[i],options.key,options,rng)
    return chord
  })
}

export function chordIntervals(chord){
  switch(chord.color){
    case 'maj7': return [0,4,7,11]
    case 'min7': return [0,3,7,10]
    case 'add9': return chord.quality==='minor'?[0,3,7,14]:[0,4,7,14]
    case 'maj9': return [0,4,7,11,14]
    case 'min9': return [0,3,7,10,14]
    case 'sus2': return [0,2,7]
    case 'sus4': return [0,5,7]
    case 'dominant7': return [0,4,7,10]
    case 'diminished': return [0,3,6]
    default: return chord.quality==='minor'?[0,3,7]:chord.quality==='diminished'?[0,3,6]:[0,4,7]
  }
}
