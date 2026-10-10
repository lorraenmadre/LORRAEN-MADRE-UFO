import React,{useState} from 'react';
import {Entity} from '../types';
import {boxLabel,boxRole,isUnnamed,orderForBoard} from '../entityOrder';
import {slotForEntity} from '../planSlots';
interface Props{entities:Entity[];onAddSatellite:(e:Entity)=>void;onSelect:(id:string)=>void;onUpdate:(e:Entity)=>void}
const STEPS:Record<string,string[]>={
 planets:['Name the project that lives on this planet.','Set one goal for the next six months: what will be true, how you will measure it, and by when.','Build it out in the voice app: 1 goal, 8 outcomes, 64 tasks.','Check the Time view to see when the planet is lit, and push it forward then.'],
 dinosaurs:['Connect the social media account shown on the card (Instagram, TikTok, YouTube and so on).','Name the dinosaur and give it the part of your family office it runs, like brand, story or community.','Let it post, answer and report back for that domain on its own rhythm.'],
 satellites:['Add each outside tool or partner you rely on.','Name what it does for your family office.'],
};
const SECTIONS=[
 {key:'mothership',title:'Mothership',note:'Your home for the whole picture. Name what is yours, describe its purpose, and fill the empty spaces as your universe takes shape.',match:(e:Entity)=>e.type==='church'||e.type==='holding_company'||e.type==='trust'},
 {key:'planets',title:'Planets · projects',note:'Each planet is a Project that runs on a six-month cadence. Choose a planet and build its Project: clarify the Goal, develop a Plan and its task spaces, then shape the Lean Value Canvas.',match:(e:Entity)=>!!slotForEntity(e.id)},
 {key:'dinosaurs',title:'Dinosaurs · living domains',note:'Each Dinosaur connects one social media account to run one domain of your family office. Its zodiac sign sets its voice; its platform is where it works. Name it and shape the Goal it supports.',match:(e:Entity)=>e.type==='dinosaur'},
 {key:'satellites',title:'Satellites',note:'Satellites are external connections needed to run your personal AI—services, tools or people not already included in your setup. Add one, then define what it connects and why.',match:(e:Entity)=>e.type==='satellite'},
];
export default function ClaimSections({entities,onSelect,onUpdate,onAddSatellite}:Props){
 const [satelliteName,setSatelliteName]=useState('');const ordered=orderForBoard(entities);const seen=new Set<string>();
 return <section className="space-y-12" aria-label="Name and claim">{SECTIONS.map(s=>{
 if(s.key==='mothership')return null;
 const items=ordered.filter(e=>!seen.has(e.id)&&s.match(e));items.forEach(e=>seen.add(e.id));if(!items.length&&s.key!=='satellites')return null;const unnamed=items.filter(isUnnamed);
 return <section key={s.key} id={s.key}><div className="lm-board-heading"><h2 className="lm-section-title">{s.title}</h2><span className="lm-caption">{items.filter(e=>!isUnnamed(e)).length}/{items.length} named</span></div><p className="lm-section-description">{s.note}</p>{STEPS[s.key]&&<ol className="lm-steps">{STEPS[s.key].map(t=><li key={t}>{t}</li>)}</ol>}
 {s.key==='dinosaurs'&&<button className="lm-pill lm-pill-white mb-4" onClick={()=>onAddSatellite({id:`dinosaur-${crypto.randomUUID()}`,type:'dinosaur',name:'',description:'Custom social-media and technology domain. Define its Goal, stack and role.',status:'Draft · not activated'})}>Add Dinosaur</button>}{s.key==='satellites'&&<form className="lm-add-satellite" onSubmit={ev=>{ev.preventDefault();if(!satelliteName.trim())return;onAddSatellite({id:`satellite-${crypto.randomUUID()}`,type:'satellite',name:satelliteName.trim(),description:'A connection named by the Hero. Choose its role and setup next.',status:'Draft · not connected'});setSatelliteName('');}}><label htmlFor="satellite-name">Name a connection</label><input id="satellite-name" value={satelliteName} onChange={e=>setSatelliteName(e.target.value)} placeholder="My new connection" required/><button className="lm-pill" disabled={!satelliteName.trim()}>Add Satellite</button><p className="lm-caption">Creates a session draft. No external account is connected yet.</p></form>}
 {unnamed.length>0&&<div className="lm-resource-grid">{unnamed.map(e=><ClaimCard key={e.id} e={e} onSelect={onSelect} onUpdate={onUpdate}/>)}</div>}</section>;
 })}</section>;
}
function ClaimCard({e,onSelect,onUpdate}:{e:Entity;onSelect:(id:string)=>void;onUpdate:(e:Entity)=>void}){
 const [value,setValue]=useState('');return <form className="lm-resource-card lm-empty-card" onSubmit={ev=>{ev.preventDefault();if(value.trim())onUpdate({...e,name:value.trim()});}}><button type="button" onClick={()=>onSelect(e.id)}>{boxLabel(e)} →</button><p>{e.type==='dinosaur'?'Name your domain, then shape the Goal it serves.':boxRole(e)||'Give this part of your universe a name and purpose.'}</p><label><span className="text-[#00bf63]" aria-hidden="true">&gt; </span><input value={value} onChange={ev=>setValue(ev.target.value)} placeholder="name it" aria-label={`${boxLabel(e)}: name it`}/></label><button className="lm-claim-save" disabled={!value.trim()}>Keep name</button></form>;
}
