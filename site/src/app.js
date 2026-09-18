import { FEEL_PRESETS } from './feel-presets.js'
import { ROOT_KEYS, chordIntervals, generateProgression, varyProgression } from './engine.js'

const $ = id => document.getElementById(id)
const STORAGE_KEY='chord-feel:v1'
const defaults={key:'C',mode:'major',feel:'dreamy',length:4,adventure:45,bpm:92,progression:[],locked:[false,false,false,false]}
let state=loadState()
let playToken=0, audioContext=null, activeNodes=[]

function loadState(){
  try { return {...defaults,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')} } catch { return {...defaults} }
}
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)) }
function options(){ return {key:state.key,mode:state.mode,feel:state.feel,length:state.length,adventure:state.adventure} }
function esc(text){ return String(text).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])) }

function initSelectors(){
  $('keySelect').innerHTML=ROOT_KEYS.map(k=>`<option value="${k}">${k}</option>`).join('')
  $('feelSelect').innerHTML=Object.entries(FEEL_PRESETS).map(([id,p])=>`<option value="${id}">${p.label}</option>`).join('')
  $('keySelect').value=state.key; $('modeSelect').value=state.mode; $('feelSelect').value=state.feel; $('lengthSelect').value=String(state.length)
  $('adventureInput').value=String(state.adventure); $('bpmInput').value=String(state.bpm)
}
function renderFeel(){
  const p=FEEL_PRESETS[state.feel]
  $('feelLabel').textContent=p.label; $('feelDescription').textContent=p.description
  $('feelBars').innerHTML=['brightness','tension','resolution'].map(name=>`<div><span>${name}</span><i><b style="width:${p.dimensions[name]}%"></b></i></div>`).join('')
  $('progressionTitle').textContent=`${state.key} ${state.mode} · ${p.label}`
}
function renderControls(){ $('adventureValue').textContent=state.adventure; $('bpmValue').textContent=`${state.bpm} BPM` }
function renderProgression(activeIndex=null){
  $('chordGrid').innerHTML=state.progression.map((chord,i)=>`
    <article class="chord-card ${activeIndex===i?'active':''} ${chord.borrowed?'borrowed':''}" data-index="${i}">
      <div class="card-topline"><span>${String(i+1).padStart(2,'0')}</span>${chord.borrowed?'<span class="borrowed-label">borrowed</span>':''}<button class="lock-button ${state.locked[i]?'locked':''}" data-lock="${i}" aria-label="${state.locked[i]?'Unlock':'Lock'} ${esc(chord.symbol)}">${state.locked[i]?'LOCKED':'LOCK'}</button></div>
      <strong>${esc(chord.symbol)}</strong><p>${esc(chord.roman)}</p>
    </article>`).join('')
  document.querySelectorAll('[data-lock]').forEach(btn=>btn.addEventListener('click',()=>{ const i=Number(btn.dataset.lock); state.locked[i]=!state.locked[i]; saveState(); renderProgression() }))
}
function render(){ renderFeel(); renderControls(); renderProgression(); saveState() }
function regenerate(){ stopPlayback(); state.progression=generateProgression(options()); state.locked=Array(state.length).fill(false); render() }
function variation(){ stopPlayback(); state.progression=varyProgression(state.progression,options(),state.locked); render() }

function stopPlayback(){
  playToken++; activeNodes.forEach(node=>{ try{node.stop()}catch{} }); activeNodes=[]; $('playButton').textContent='▶ Play'; renderProgression()
}
function rootPc(root){ return {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11}[root]??0 }
function midiToHz(midi){ return 440*Math.pow(2,(midi-69)/12) }
function playChord(chord,duration,index,token){
  if(token!==playToken) return
  renderProgression(index)
  const now=audioContext.currentTime, gain=audioContext.createGain(); gain.gain.setValueAtTime(.0001,now); gain.gain.exponentialRampToValueAtTime(.12,now+.025); gain.gain.exponentialRampToValueAtTime(.055,now+.28); gain.gain.exponentialRampToValueAtTime(.0001,now+Math.max(.4,duration*.88)); gain.connect(audioContext.destination)
  const rootMidi=48+rootPc(chord.root)
  chordIntervals(chord).forEach((interval,j)=>{
    const osc=audioContext.createOscillator(); osc.type=j===0?'triangle':'sine'; osc.frequency.value=midiToHz(rootMidi+interval); osc.connect(gain); osc.start(now); osc.stop(now+Math.max(.45,duration*.9)); activeNodes.push(osc)
  })
}
async function play(){
  if($('playButton').textContent.includes('Stop')){ stopPlayback(); return }
  audioContext ||= new (window.AudioContext||window.webkitAudioContext)()
  if(audioContext.state==='suspended') await audioContext.resume()
  const token=++playToken, secondsPerChord=(60/state.bpm)*4
  $('playButton').textContent='■ Stop'
  for(let i=0;i<state.progression.length;i++){
    if(token!==playToken) return
    playChord(state.progression[i],secondsPerChord,i,token)
    await new Promise(r=>setTimeout(r,secondsPerChord*1000))
  }
  if(token===playToken){ activeNodes=[]; $('playButton').textContent='▶ Play'; renderProgression() }
}

initSelectors()
if(!state.progression.length || state.progression.length!==state.length){ state.progression=generateProgression(options()); state.locked=Array(state.length).fill(false) }
render()

$('generateButton').addEventListener('click',regenerate)
$('variationButton').addEventListener('click',variation)
$('playButton').addEventListener('click',play)
$('copyButton').addEventListener('click',async()=>{ const text=state.progression.map(c=>c.symbol).join(' → '); try{await navigator.clipboard.writeText(text); $('copyButton').textContent='Copied'; setTimeout(()=>$('copyButton').textContent='Copy progression',1200)}catch{$('copyButton').textContent=text} })
$('keySelect').addEventListener('change',e=>{state.key=e.target.value; regenerate()})
$('modeSelect').addEventListener('change',e=>{state.mode=e.target.value; regenerate()})
$('feelSelect').addEventListener('change',e=>{state.feel=e.target.value; regenerate()})
$('lengthSelect').addEventListener('change',e=>{state.length=Number(e.target.value); regenerate()})
$('adventureInput').addEventListener('input',e=>{state.adventure=Number(e.target.value); renderControls(); saveState()})
$('bpmInput').addEventListener('input',e=>{state.bpm=Number(e.target.value); renderControls(); saveState()})
