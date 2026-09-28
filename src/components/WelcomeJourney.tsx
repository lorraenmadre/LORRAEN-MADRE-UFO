import React from 'react';
import {JOURNEY_DAYS,JourneyState,hasContribution} from '../journey';
interface Props{journey:JourneyState;onChange:(state:JourneyState)=>void;storageError?:string}
export default function WelcomeJourney({journey,onChange,storageError}:Props){
 const day=JOURNEY_DAYS[journey.day];const complete=JOURNEY_DAYS.filter((_,i)=>hasContribution(journey,i)).length;
 return <section className="lm-welcome" id="wish-well">
 <p className="lm-kicker">WELCOME ABOARD · YOUR UNIVERSAL FAMILY OFFICE</p>
 <h1>Make your wishes work.</h1>
 <p className="lm-intro-lead">Hero, you are building a Universal Family Office: a place to coordinate your family’s care, resources, people, technology and work around the life you want to create.</p>
 <p>This is the operating layer for designing happily ever after. Your mothership holds your universe together. Its 12 corresponding components connect across your Houses, tools and work. The Engine is fueled by your wishes—and you, mind, body and soul, are at its center.</p>
 <ol className="lm-how-to"><li><strong>Tell.</strong><span>Start with your wish and how you feel. Speak or type; one thought is enough.</span></li><li><strong>Shape.</strong><span>Use a WISH WELL cue to clarify the Story, Goal, Project or next Task your wish needs.</span></li><li><strong>Build.</strong><span>Keep your contribution. A day lights up, your story stays with you, and you can return to develop it.</span></li></ol>
 <nav className="lm-journey-nav" aria-label="Your journey"><a href="#engine">Your 12-box Engine</a><a href="#operating-board">Time · Space · Story</a><a href="#houses">Wonderland · product Houses</a></nav>
 <div className="lm-journey-progress"><h2 className="lm-section-title">14 days to begin. Your own pace to continue.</h2><span>{complete} of 14 days contributed</span></div>
 <p>Start anywhere, revisit any day, or pick up where a workshop leaves you. A checkmark means you saved a spoken or typed contribution. Nothing expires if you pause.</p>
 <div className="lm-days" aria-label="Choose your onboarding day">{JOURNEY_DAYS.map((d,i)=>{const done=hasContribution(journey,i);return <button type="button" key={i} aria-pressed={journey.day===i} aria-label={`Day ${i+1}: ${journey.titles[i]||d.title}${done?' — contribution saved':''}`} onClick={()=>onChange({...journey,day:i})}><span>{done?'✓':String(i+1).padStart(2,'0')}</span><small>{journey.titles[i]||d.title}</small></button>})}</div>
 <div className="lm-day-focus"><p className="lm-kicker">DAY {journey.day+1} {hasContribution(journey,journey.day)?'· CONTRIBUTION SAVED ✓':'· READY FOR YOUR STORY'}</p><h2 className="lm-section-title">{journey.titles[journey.day]||day.title}</h2><p>{day.focus}</p><p className="lm-day-cue">WISH WELL cue: {day.cue}</p><details><summary>Make this day your own</summary><label htmlFor="day-title">Day title</label><input id="day-title" value={journey.titles[journey.day]||''} placeholder={day.title} onChange={e=>onChange({...journey,titles:{...journey.titles,[journey.day]:e.target.value}})}/><p>Use this space for your own workshop or topic. Your contribution history stays attached to this day.</p></details></div>
 <p className="lm-caption" role={storageError?'alert':undefined}>{storageError||'Progress and words are saved on this browser for this profile. They are not yet synced between devices. Checkmarks track participation, not service activation.'}</p>
 </section>;
}
