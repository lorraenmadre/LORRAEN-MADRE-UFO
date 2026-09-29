import React,{useState} from 'react';
import {Entity} from '../types';
import {boxLabel,boxRole,isUnnamed,orderForBoard} from '../entityOrder';
import PlatformLabel from './PlatformLabel';
import system from '../ufo-system.json';
import {slotForEntity} from '../planSlots';
import {calculateProgress} from '../progress';
import EntityArt,{Progress} from './EntityArt';
interface Props{entities:Entity[];onAddSatellite:(e:Entity)=>void;onSelect:(id:string)=>void;onUpdate:(e:Entity)=>void}
const STEPS:Record<string,string[]>={
 planets:['Name the project that lives on this planet.','Set one goal for the next six months: what will be true, how you will measure it, and by when.','Build it out in the voice app: 1 goal, 8 outcomes, 64 tasks.','Check the Time view to see when the planet is lit, and push it forward then.'],
 dinosaurs:['Connect the social media account shown on the card (Instagram, TikTok, YouTube and so on).','Name the dinosaur and give it the part of your family office it runs, like brand, story or community.','Let it post, answer and report back for that domain on its own rhythm.'],
 houses:['Open a House to see its product and where it lives.','Do that House’s work there: money in Woo Woo Watch, recipes in The Cookbook, and so on.','Come back here to see how far along each House is.'],
 satellites:['Add each outside tool or partner you rely on.','Name what it does for your family office.'],
};
const SECTIONS=[
 {key:'mothership',title:'Mothership',note:'Your home for the whole picture. Name what is yours, describe its purpose, and fill the empty spaces as your universe takes shape.',match:(e:Entity)=>e.type==='church'||e.type==='holding_company'||e.type==='trust'},
 {key:'planets',title:'Planets · projects',note:'Each planet is a Project that runs on a six-month cadence. Choose a planet and build its Project: clarify the Goal, develop a Plan and its task spaces, then shape the Lean Value Canvas.',match:(e:Entity)=>!!slotForEntity(e.id)},
 {key:'dinosaurs',title:'Dinosaurs · living domains',note:'Each Dinosaur connects one social media account to run one domain of your family office. Its zodiac sign sets its voice; its platform is where it works. Name it and shape the Goal it supports.',match:(e:Entity)=>e.type==='dinosaur'},
 {key:'houses',title:'Wonderland · product Houses',note:'Bring one House online at a time. Each House gives part of your work a place, a product and a tool. Explore its purpose, gather what you already have, then take the next setup step.',match:(e:Entity)=>e.type==='offering'},
 {key:'satellites',title:'Satellites',note:'Satellites are external connections needed to run your personal AI—services, tools or people not already included in your setup. Add one, then define what it connects and why.',match:(e:Entity)=>e.type==='satellite'},
];
const RESOURCES:Record<string,{url:string;label:string;note:string}>={
 'product-house-4':{url:'https://github.com/anthropics/claude-cookbooks',label:'Read Anthropic cookbooks',note:'Tech recipes · WISH WELL tech and kitchen edition to follow'},
 'product-house-6':{url:'https://www.notion.com/',label:'Open Notion',note:'Fruitful Frameworks template download not yet linked'},
 'product-house-10':{url:'https://trello.com/',label:'Open Trello',note:'Dream Backlog template download not yet linked'},
 'product-house-12':{url:'https://junglebook.lorraenmadre.com/',label:'Explore Jungle Book',note:'Golden Ticket · Story Calendar'},
};
const HOUSE_PURPOSES:Record<number,string>={
 1:'Give your family office a home. Name your mothership and organize the projects that support it.',
 2:'Explore your resources and timing. Keep the questions behind your money decisions in view.',
 3:'Clarify the change you want. Shape a Goal and the evidence that will tell you it is working.',
 4:'Build with practical recipes for technology, food and family life. Start with what you have.',
 5:'Bring your people and work together. Coordinate a sprint and keep the next action visible.',
 6:'Give your routines a home. Organize the repeatable ways your family office works.',
 7:'Coordinate the daily Engine. Keep your documents, actions and accountability connected.',
 8:'Know what progress looks like. Gather Outcomes, evidence, protection and exit questions.',
 9:'Give a Goal a Plan: eight Outcomes and 64 Task spaces, with room for trust, travel and care.',
 10:'Keep the wish before it gets lost. Collect your intentions and stories in the Dream Backlog.',
 11:'Keep your people connected. Organize relationships, conversations and the next follow-up.',
 12:'Gather your Stories across the Houses. Let the Story Calendar invite your next chapter.'
};
export default function ClaimSections({entities,onSelect,onUpdate,onAddSatellite}:Props){
 const [satelliteName,setSatelliteName]=useState('');const ordered=orderForBoard(entities);const seen=new Set<string>();
 return <section className="space-y-12" aria-label="Name and claim">{SECTIONS.map(s=>{
 if(s.key==='mothership')return null;
 const items=ordered.filter(e=>!seen.has(e.id)&&s.match(e));items.forEach(e=>seen.add(e.id));if(!items.length&&s.key!=='satellites')return null;
 return <section key={s.key} id={s.key}><div className="lm-board-heading"><h2 className="lm-section-title">{s.title}</h2><span className="lm-caption">{items.filter(e=>!isUnnamed(e)).length}/{items.length} named</span></div><p className="lm-section-description">{s.note}</p>{STEPS[s.key]&&<ol className="lm-steps">{STEPS[s.key].map(t=><li key={t}>{t}</li>)}</ol>}
 {s.key==='dinosaurs'&&<button className="lm-pill lm-pill-white mb-4" onClick={()=>onAddSatellite({id:`dinosaur-${crypto.randomUUID()}`,type:'dinosaur',name:'',description:'Custom social-media and technology domain. Define its Goal, stack and role.',status:'Draft · not activated'})}>Add Dinosaur</button>}{s.key==='satellites'&&<form className="lm-add-satellite" onSubmit={ev=>{ev.preventDefault();if(!satelliteName.trim())return;onAddSatellite({id:`satellite-${crypto.randomUUID()}`,type:'satellite',name:satelliteName.trim(),description:'A connection named by the Hero. Choose its role and setup next.',status:'Draft · not connected'});setSatelliteName('');}}><label htmlFor="satellite-name">Name a connection</label><input id="satellite-name" value={satelliteName} onChange={e=>setSatelliteName(e.target.value)} placeholder="My new connection" required/><button className="lm-pill" disabled={!satelliteName.trim()}>Add Satellite</button><p className="lm-caption">Creates a session draft. No external account is connected yet.</p></form>}
 <div className={`lm-resource-grid ${s.key==='houses'?'is-houses':''}`}>{items.map(e=>{
 const house=system.houses.find(h=>`product-house-${h.number}`===e.id);const resource=RESOURCES[e.id];
 if(s.key==='houses')return <article key={e.id} className="lm-resource-card"><span className="lm-card-top"><small>{e.house} · {house?.department}</small><EntityArt entity={e} size={32}/></span><h3>{e.name||house?.product||'Name this House'}</h3><p>{house?HOUSE_PURPOSES[house.number]:e.description}</p><PlatformLabel platform={e.platform||house?.platform||undefined}/><div className="lm-resource-actions"><button type="button" onClick={()=>onSelect(e.id)}>{isUnnamed(e)?'Name & shape this House':'Open this House'} →</button>{resource&&<a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.label} ↗</a>}</div>{resource&&<small>{resource.note}</small>}<small>Connection not verified</small><Progress value={calculateProgress(e)}/></article>;
 return isUnnamed(e)?<ClaimCard key={e.id} e={e} onSelect={onSelect} onUpdate={onUpdate}/>:<button key={e.id} type="button" onClick={()=>onSelect(e.id)} className="lm-resource-card lm-entity-card"><span className="lm-card-top"><small>{boxLabel(e)}</small><EntityArt entity={e} size={32}/></span><h3>{e.name}</h3>{e.type==='dinosaur'&&<p>Shape the Goal, message and role of this domain.</p>}{e.platform?<PlatformLabel platform={e.platform}/>:<span className="lm-caption">{boxRole(e)}</span>}{e.type==='dinosaur'&&<small>{e.status||'Role to define · not activated'}</small>}<Progress value={calculateProgress(e)}/></button>;
 })}</div>{s.key==='houses'&&<p className="lm-caption mt-5"><a className="underline underline-offset-4" href="https://composio.dev/" target="_blank" rel="noopener noreferrer">Composio · explore connections between your Houses ↗</a></p>}</section>;
 })}</section>;
}
function ClaimCard({e,onSelect,onUpdate}:{e:Entity;onSelect:(id:string)=>void;onUpdate:(e:Entity)=>void}){
 const [value,setValue]=useState('');return <form className="lm-resource-card lm-empty-card" onSubmit={ev=>{ev.preventDefault();if(value.trim())onUpdate({...e,name:value.trim()});}}><button type="button" onClick={()=>onSelect(e.id)}>{boxLabel(e)} →</button><p>{e.type==='dinosaur'?'Name your domain, then shape the Goal it serves.':boxRole(e)||'Give this part of your universe a name and purpose.'}</p><label><span className="text-[#00bf63]" aria-hidden="true">&gt; </span><input value={value} onChange={ev=>setValue(ev.target.value)} placeholder="name it" aria-label={`${boxLabel(e)}: name it`}/></label><button className="lm-claim-save" disabled={!value.trim()}>Keep name</button></form>;
}
