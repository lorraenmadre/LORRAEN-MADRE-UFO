import React,{useState} from 'react';
import {Entity} from '../types';
import {boxLabel,boxRole,isUnnamed,orderForBoard} from '../entityOrder';
import PlatformLabel from './PlatformLabel';
import system from '../ufo-system.json';
import {slotForEntity} from '../planSlots';
interface Props{entities:Entity[];onAddSatellite:(e:Entity)=>void;onSelect:(id:string)=>void;onUpdate:(e:Entity)=>void}
const SECTIONS=[
 {key:'mothership',title:'Mothership',note:'Your home for the whole picture. Name what is yours, describe its purpose, and fill the empty spaces as your universe takes shape.',match:(e:Entity)=>e.type==='church'||e.type==='holding_company'||e.type==='trust'},
 {key:'planets',title:'Plans',note:'Choose and name one of your 16 Plan spaces. A Plan holds one Goal, eight Outcomes and 64 Task spaces. Keep the spaces you do not need yet open.',match:(e:Entity)=>!!slotForEntity(e.id)},
 {key:'dinosaurs',title:'Dinosaurs · living domains',note:'Be the chief of your domains. Give each Dinosaur a Goal to support, a message to carry and a role in your marketing and technology. Good Dinosaurs serve your intentions: you shape their work and review what they do.',match:(e:Entity)=>e.type==='dinosaur'},
 {key:'houses',title:'Wonderland · product Houses',note:'Bring one House online at a time. Each House gives part of your work a place, a product and a tool. Explore its purpose, gather what you already have, then take the next setup step.',match:(e:Entity)=>e.type==='offering'},
 {key:'satellites',title:'Satellites',note:'Bring another person, service or tool into your universe. Name the connection, then open its card to describe its role.',match:(e:Entity)=>e.type==='satellite'},
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
 const items=ordered.filter(e=>!seen.has(e.id)&&s.match(e));items.forEach(e=>seen.add(e.id));if(!items.length&&s.key!=='satellites')return null;
 return <section key={s.key} id={s.key}><div className="lm-board-heading"><h2 className="lm-section-title">{s.title}</h2><span className="lm-caption">{items.filter(e=>!isUnnamed(e)).length}/{items.length} named</span></div><p className="lm-section-description">{s.note}</p>
 {s.key==='satellites'&&<form className="lm-add-satellite" onSubmit={ev=>{ev.preventDefault();if(!satelliteName.trim())return;onAddSatellite({id:`satellite-${crypto.randomUUID()}`,type:'satellite',name:satelliteName.trim(),description:'A connection named by the Hero. Choose its role and setup next.',status:'Draft · not connected'});setSatelliteName('');}}><label htmlFor="satellite-name">Name a connection</label><input id="satellite-name" value={satelliteName} onChange={e=>setSatelliteName(e.target.value)} placeholder="My new connection" required/><button className="lm-pill" disabled={!satelliteName.trim()}>Add Satellite</button><p className="lm-caption">Creates a session draft. No external account is connected yet.</p></form>}
 <div className={`lm-resource-grid ${s.key==='houses'?'is-houses':''}`}>{items.map(e=>{
 const house=system.houses.find(h=>`product-house-${h.number}`===e.id);const resource=RESOURCES[e.id];
 if(s.key==='houses')return <article key={e.id} className="lm-resource-card"><small>{e.house} · {house?.department}</small><h3>{e.name||house?.product||'Name this House'}</h3><p>{house?HOUSE_PURPOSES[house.number]:e.description}</p><PlatformLabel platform={e.platform||house?.platform||undefined}/><div className="lm-resource-actions"><button type="button" onClick={()=>onSelect(e.id)}>{isUnnamed(e)?'Name & shape this House':'Open this House'} →</button>{resource&&<a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.label} ↗</a>}</div>{resource&&<small>{resource.note}</small>}<small>Connection not verified</small></article>;
 return isUnnamed(e)?<ClaimCard key={e.id} e={e} onSelect={onSelect} onUpdate={onUpdate}/>:<button key={e.id} type="button" onClick={()=>onSelect(e.id)} className="lm-resource-card lm-entity-card"><small>{boxLabel(e)}</small><h3>{e.name}</h3>{e.type==='dinosaur'&&<p>Shape the Goal, message and role of this domain.</p>}{e.platform?<PlatformLabel platform={e.platform}/>:<span className="lm-caption">{boxRole(e)}</span>}{e.type==='dinosaur'&&<small>{e.status||'Role to define · not activated'}</small>}</button>;
 })}</div>{s.key==='houses'&&<p className="lm-caption mt-5"><a className="underline underline-offset-4" href="https://composio.dev/" target="_blank" rel="noopener noreferrer">Composio · explore connections between your Houses ↗</a></p>}</section>;
 })}</section>;
}
function ClaimCard({e,onSelect,onUpdate}:{e:Entity;onSelect:(id:string)=>void;onUpdate:(e:Entity)=>void}){
 const [value,setValue]=useState('');return <form className="lm-resource-card lm-empty-card" onSubmit={ev=>{ev.preventDefault();if(value.trim())onUpdate({...e,name:value.trim()});}}><button type="button" onClick={()=>onSelect(e.id)}>{boxLabel(e)} →</button><p>{e.type==='dinosaur'?'Name your domain, then shape the Goal it serves.':boxRole(e)||'Give this part of your universe a name and purpose.'}</p><label><span className="text-[#00bf63]" aria-hidden="true">&gt; </span><input value={value} onChange={ev=>setValue(ev.target.value)} placeholder="name it" aria-label={`${boxLabel(e)}: name it`}/></label><button className="lm-claim-save" disabled={!value.trim()}>Keep name</button></form>;
}
