'use strict';
const $ = id => document.getElementById(id);
const EVENTS = [
  { id:1, name:'HackIEM 2026', date:'2026-12-05T09:00:00+05:30', venue:'AIML Lab, Gurukul Campus', category:'Technical', desc:'24-hour hackathon on applied machine learning. Teams of 2-4. Problem statements are released at the opening ceremony.' },
  { id:2, name:'Hands-on Deep Learning with PyTorch', date:'2026-12-12T10:00:00+05:30', venue:'Lab 4, Ashram Building', category:'Workshop', desc:'Two-day workshop covering tensors, autograd and CNNs. Bring a laptop; no prior PyTorch experience needed.' },
  { id:3, name:'Guest lecture: Large language models for Indian languages', date:'2026-12-19T14:30:00+05:30', venue:'Seminar Hall, 2nd floor', category:'Lecture', desc:'An industry researcher discusses building and evaluating language models for low-resource Indic languages, followed by an open Q&A.' },
  { id:4, name:'Sharod Sandhya: cultural evening', date:'2027-01-09T17:00:00+05:30', venue:'Main Auditorium', category:'Cultural', desc:'An evening of music, dance and drama performed by students of the department. Open to families.' },
  { id:5, name:'Line-follower robotics challenge', date:'2027-01-23T10:00:00+05:30', venue:'IoT Lab', category:'Technical', desc:'Build and race an autonomous line-following robot. Kits are available on request. Judged on speed, accuracy and build quality.' },
  { id:6, name:'Innovacion 2027: annual tech fest', date:'2027-02-06T09:00:00+05:30', venue:'Gurukul Campus, all blocks', category:'Technical', desc:'Three days of coding contests, project exhibitions, paper presentations and gaming. The biggest event on the department calendar.' }
];
function fmt(d, opts){ return new Date(d).toLocaleDateString('en-IN', Object.assign({ timeZone:'Asia/Kolkata' }, opts)); }
function renderEvents(){
  const sorted = [...EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date));
  $('eventList').innerHTML = sorted.map(ev => `
    <li class="event" data-cat="${ev.category}">
      <div class="date"><b>${fmt(ev.date,{day:'2-digit'})}</b><span>${fmt(ev.date,{month:'short',year:'numeric'})}</span></div>
      <div><h3>${ev.name}</h3><p class="meta">${fmt(ev.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})} &middot; ${ev.venue}</p><p>${ev.desc}</p></div>
      <span class="tag">${ev.category}</span>
    </li>`).join('');
}
function fillEventSelect(){ $('event').innerHTML = '<option value="">Select an event</option>' + EVENTS.map(ev => `<option value="${ev.id}">${ev.name}</option>`).join(''); }
$('chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip'); if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
  document.querySelectorAll('.event').forEach(li => li.classList.toggle('is-hidden', chip.dataset.cat !== 'All' && li.dataset.cat !== chip.dataset.cat));
});
function getNextEvent(){ const now = Date.now(); return [...EVENTS].filter(ev => new Date(ev.date) > now).sort((a,b) => new Date(a.date)-new Date(b.date))[0]; }
const pad = n => String(n).padStart(2,'0');
function updateCountdown(){
  const next = getNextEvent();
  if (!next){ $('nextName').textContent='No upcoming events'; $('nextMeta').textContent='Check back next semester.'; return; }
  const diff = new Date(next.date)-Date.now();
  $('nextName').textContent=next.name;
  $('nextMeta').textContent=fmt(next.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})+' · '+next.venue;
  $('cdDays').textContent=pad(Math.floor(diff/86400000));
  $('cdHours').textContent=pad(Math.floor(diff%86400000/3600000));
  $('cdMins').textContent=pad(Math.floor(diff%3600000/60000));
  $('cdSecs').textContent=pad(Math.floor(diff%60000/1000));
}
function showClock(){ $('clock').textContent=new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Kolkata'}); }
function tick(){ updateCountdown(); showClock(); } tick(); setInterval(tick,1000);
function applyTheme(mode){ const dark=mode==='dark'; document.body.classList.toggle('dark',dark); $('themeIcon').textContent=dark?'☀':'☾'; try{localStorage.setItem('iem-theme',mode);}catch(e){} }
let saved=null; try{saved=localStorage.getItem('iem-theme');}catch(e){}
const prefersDark=matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(saved||(prefersDark?'dark':'light'));
$('themeToggle').addEventListener('click',()=>applyTheme(document.body.classList.contains('dark')?'light':'dark'));
$('menuBtn').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('menuBtn').setAttribute('aria-expanded',open);});
$('nav').addEventListener('click',e=>{if(e.target.tagName==='A')$('nav').classList.remove('open');});
const links=document.querySelectorAll('.nav a');
const spy=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting)links.forEach(a=>a.classList.toggle('current',a.getAttribute('href')==='#'+en.target.id));});},{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>spy.observe(s));
function setError(id,msg){const field=$(id);if(field)field.classList.toggle('is-invalid',!!msg);$('err-'+id).textContent=msg||'';}
const NAME_RE=/^[A-Za-z][A-Za-z .'-]{1,59}$/;
const EMAIL_RE=/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const RULES={
 name:{re:NAME_RE,bad:'Use letters only (2-60 characters).'},
 roll:{re:/^\d{10}$/,bad:'Roll number must be exactly 10 digits.'},
 email:{re:EMAIL_RE,bad:'Enter a valid email, e.g. you@iem.edu.in.'},
 phone:{re:/^[6-9]\d{9}$/,bad:'Enter a 10-digit mobile number starting with 6-9.'},
 fname:{re:NAME_RE,bad:'Use letters only (2-60 characters).'},
 femail:{re:EMAIL_RE,bad:'Enter a valid email address.'}
};
function checkField(id){
 let msg='';const r=RULES[id];
 if(r){const v=$(id).value.trim();msg=!v?'This field is required.':(r.re.test(v)?'':r.bad);}
 else if(id==='dept')msg=$('dept').value?'':'Select your department.';
 else if(id==='event')msg=$('event').value?'':'Select the event you want to register for.';
 else if(id==='gender')msg=document.querySelector('input[name=gender]:checked')?'':'Select an option.';
 else if(id==='fmsg'){const v=$('fmsg').value.trim();msg=!v?'This field is required.':(v.length<15?'Message must be at least 15 characters.':'');}
 setError(id,msg);return !msg;
}
function wireForm(formId,ids,statusId,okText){
 const form=$(formId);
 form.addEventListener('submit',e=>{
  e.preventDefault();const results=ids.map(checkField);const status=$(statusId);
  if(results.every(Boolean)){status.textContent=okText();status.className='status ok';form.reset();}
  else{status.textContent='Some fields need attention. Fix the highlighted ones and submit again.';status.className='status bad';}
 });
 const recheck=e=>{const id=e.target.name==='gender'?'gender':e.target.id;if(ids.includes(id)&&$('err-'+id).textContent)checkField(id);};
 form.addEventListener('input',recheck);form.addEventListener('change',recheck);
}
wireForm('regForm',['name','roll','dept','email','phone','gender','event'],'regStatus',()=>`Thank you, ${$('name').value.trim()}. You are registered for ${$('event').selectedOptions[0].text}.`);
wireForm('fbForm',['fname','femail','fmsg'],'fbStatus',()=>'Thank you for your feedback. We will read it.');
renderEvents();fillEventSelect();