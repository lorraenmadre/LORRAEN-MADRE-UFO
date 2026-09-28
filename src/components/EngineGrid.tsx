import React from 'react';
import system from '../ufo-system.json';
import {JourneyState} from '../journey';
import VoiceOrb from './VoiceOrb';
export const ENGINE_POSITIONS=[[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[4,3],[4,2],[4,1],[3,1],[2,1]];
export default function EngineGrid({journey,onSelect}:{journey:JourneyState;onSelect:(component:number)=>void}){
 const houses=system.houses.filter(h=>h.number<=12);const started=new Set(journey.contributions.map(c=>c.component).filter(Boolean));
 return <section className="lm-engine-shell" id="engine"><p className="lm-kicker">YOUR MOTHERSHIP · FUELED BY WISHES</p><h2 className="lm-section-title">Twelve components. One connected universe.</h2><p>Choose a component to give your next wish a home. The same 12-box shape repeats through your family office. Fill a space, return to it, and keep building.</p><div className="lm-engine-ring" aria-label="Twelve Engine components around an open center">{houses.map((h,i)=><button type="button" key={h.number} className={started.has(h.number)?'has-contribution':''} style={{gridRow:ENGINE_POSITIONS[i][0],gridColumn:ENGINE_POSITIONS[i][1]}} aria-pressed={journey.component===h.number} onClick={()=>onSelect(h.number)}><small>{String(h.number).padStart(2,'0')} · {started.has(h.number)?'✓ Story added':'○ Add your story'}</small><span>{h.product}</span></button>)}<div className="lm-engine-center"><VoiceOrb state={journey.contributions.length?'saved':'ready'} small/><p>HERO<br/><small>mind · body · soul</small></p></div></div><p className="lm-caption">{started.size}/12 components have a contribution. Empty spaces are invitations. Provider and tool connections are verified separately.</p></section>;
}
