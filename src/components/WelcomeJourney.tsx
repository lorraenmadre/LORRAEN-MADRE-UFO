import React from 'react';
export default function WelcomeJourney({day,setDay}:{day:number;setDay:(day:number)=>void}) {
 return <section className="lm-welcome" id="wish-well">
 <p className="lm-kicker">WISH WELL · YOUR FIRST 14 DAYS</p>
 <h1>Hero, your happily ever after begins with a wish.</h1>
 <p>You are the Hero: mind, body and soul. Tell your story, find its next piece of work, and name and claim your universe—one conversation at a time.</p>
 <details><summary>Day {day+1} of 14 · Your place in the journey</summary><p>These first 14 days are for gathering your story and getting to know your Universal Family Office. Begin with your vision for the life ahead. Return at your own pace.</p><div className="lm-days" aria-label="Choose your onboarding day">{Array.from({length:14},(_,i)=><button key={i} aria-pressed={day===i} onClick={()=>setDay(i)} aria-label={`Day ${i+1}`}>{i+1}</button>)}</div><p className="lm-caption">Choose a day to explore. This is a session marker, not a completion score.</p></details>
 <nav className="lm-journey-nav" aria-label="Your journey"><a href="#engine">Meet the Engine</a><a href="#operating-board">Understand the board</a><a href="#houses">Explore Wonderland</a></nav>
 </section>;
}
