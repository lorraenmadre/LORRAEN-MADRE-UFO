import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import SpaceBoard from '../src/components/SpaceBoard';
import {INITIAL_ENTITIES} from '../src/constants';
import {boardCells} from '../src/checkerboard';
import {matchPlatform} from '../src/components/PlatformIcon';

test('Plan board keeps exactly sixteen plan destinations and preserves Queen separately',()=>{
 const markup=renderToStaticMarkup(<SpaceBoard entities={INITIAL_ENTITIES} onSelect={()=>{}} onUpdate={()=>{}}/>);
 assert.equal(boardCells(INITIAL_ENTITIES).filter(c=>c.group==='Planets'&&c.entity).length,16);
 assert.equal((markup.match(/class="lm-checker-cell /g)||[]).length,48);
 assert.equal(boardCells(INITIAL_ENTITIES).filter(c=>c.group==='Houses').length,0);
 assert.ok(!markup.includes('Houses · House'));
 assert.ok(markup.includes('Queen — view or assign person'));
 assert.ok(!markup.includes('53 named'));
});
test('unrelated platforms never borrow a misleading logo',()=>{
 assert.equal(matchPlatform('Claude'),null);
 assert.equal(matchPlatform('Digital organization'),null);
 assert.equal(matchPlatform('Meta'),null);
 assert.equal(matchPlatform('Newcastle'),null);
 assert.equal(matchPlatform('GoHighLevel CRM'),null);
 assert.equal(matchPlatform('Canva'),'canva');
 assert.equal(matchPlatform('Composio'),'composio');
});

import LorraineMadreChat from '../src/components/LorraineMadreChat';
import WelcomeJourney from '../src/components/WelcomeJourney';
import {emptyJourney,addContribution,decodeJourney,hasContribution,JOURNEY_DAYS} from '../src/journey';
import EngineGrid,{HOUSE_POSITIONS,HOUSES} from '../src/components/EngineGrid';
import FounderStatus from '../src/components/FounderStatus';
import OperatingMap from '../src/components/OperatingMap';
import ClaimSections from '../src/components/ClaimSections';
import ActionPills from '../src/components/ActionPills';
import EngineJourney,{ENGINE_CATEGORIES} from '../src/components/EngineJourney';
test('Hero conversation keeps the two requested questions and optional work cues',()=>{
 const html=renderToStaticMarkup(<LorraineMadreChat/>);
 assert.ok(html.includes('What do you wish for today?'));
 assert.ok(html.includes('How do you feel about it?'));
 assert.ok(!html.includes('WISH WELL cues')); 
 assert.ok(html.includes('Wishes get SOAP. Goals get SMART.'));
});
test('journey restores fourteen revisitable topics and supplied care offerings',()=>{
 const html=renderToStaticMarkup(<WelcomeJourney journey={emptyJourney()} onChange={()=>{}}/>);
 assert.equal((html.match(/role="tab"/g)||[]).length,14);
 assert.ok(!html.includes('What would you like to become possible?'));
 const engine=renderToStaticMarkup(<EngineJourney/>);
 assert.equal(ENGINE_CATEGORIES.length,6);
 for(const name of ['Sunshine Pocket Therapy','WealthCounsel','On my way!','Sanctuary Cell','The Cookbook','Soup Club']) assert.ok(engine.includes(name));
});

test('only a nonempty contribution checks a day; out-of-order progress and revisions survive reload',()=>{
 let state=emptyJourney();state.day=9;
 assert.equal(hasContribution(state,9),false);
 const input={day:9,wish:'  Build my travel plan  ',feeling:'Hopeful',kind:'Wish',component:9};
 assert.equal(addContribution(state,{...input,wish:'   '},'empty','now'),state);
 state=addContribution(state,input,'first','2026-09-28T20:00:00Z');
 assert.equal(hasContribution(state,9),true);assert.equal(hasContribution(state,4),false);
 state=addContribution(state,{...input,day:4,wish:'Bring my files home'},'second','2026-09-28T20:01:00Z');
 const restored=decodeJourney(JSON.stringify(state));
 assert.equal(restored.day,9);assert.equal(restored.contributions.length,2);
 assert.equal(hasContribution(restored,4),true);assert.equal(restored.notes[9].wish,'Build my travel plan');
 const revised=addContribution(restored,{...input,wish:'Review my travel plan'},'third','2026-09-28T20:02:00Z');
 assert.equal(revised.contributions.length,3);assert.equal(revised.contributions[0].wish,'Build my travel plan');
 assert.equal(addContribution(revised,{...input,wish:'Review my travel plan'},'duplicate','later'),revised);
 const html=renderToStaticMarkup(<WelcomeJourney journey={restored} onChange={()=>{}}/>);
 assert.equal((html.match(/lm-status-dot is-kept/g)||[]).length,2);
});
test('damaged browser data cannot create completion or an invalid active day',()=>{
 assert.deepEqual(decodeJourney('{broken'),emptyJourney());
 assert.deepEqual(decodeJourney(JSON.stringify({version:2,day:99,component:88,contributions:[{},null,{day:0,wish:''}]})),emptyJourney());
 assert.equal(JOURNEY_DAYS[0].title,'Vision & retirement');
 assert.equal(JOURNEY_DAYS[4].title,'Your home server');
});
test('Mothership is the Library matrix on one clock, with House 13 in the center',()=>{
 const pos=Object.entries(HOUSE_POSITIONS);
 assert.equal(pos.length,12);assert.equal(new Set(pos.map(([,x])=>x.join(','))).size,12);
 for(const [,[row,col]] of pos)assert.ok(row===1||row===4||col===1||col===4);
 assert.deepEqual([11,12,1,2].map(n=>HOUSE_POSITIONS[n]),[[1,1],[1,2],[1,3],[1,4]]);
 assert.deepEqual([5,6,7,8].map(n=>HOUSE_POSITIONS[n]),[[4,4],[4,3],[4,2],[4,1]]);
 assert.equal(HOUSES.length,13);
 const html=renderToStaticMarkup(<EngineGrid journey={emptyJourney()} onSelect={()=>{}}/>);
 assert.equal((html.match(/class="lm-engine-cell"/g)||[]).length,12);
 for(const s of ['Mothership','Business Identity','Projects','Motherboard','$1,111','Newcastle Key','$777','The Wishing Reel','lm-clock'])assert.ok(html.includes(s),s);
 for(const s of ['Nodes','NORTH NODE','Holding company','omw.life','Woo Woo','Water Wine'])assert.ok(!html.includes(s),s);
});
test('Houses appear once: no House list in founder status, operating map or claim sections',()=>{
 const founder=renderToStaticMarkup(<FounderStatus/>);
 assert.ok(!founder.includes('HOUSE 01'));assert.ok(!founder.includes('Woo Woo'));assert.ok(founder.includes('Newcastle Key'));
 const map=renderToStaticMarkup(<OperatingMap/>);
 assert.ok(!map.includes('Houses, products + cadences'));
 const claims=renderToStaticMarkup(<ClaimSections entities={INITIAL_ENTITIES} onSelect={()=>{}} onUpdate={()=>{}} onAddSatellite={()=>{}}/>);
 assert.equal((claims.match(/lm-empty-card/g)||[]).length,INITIAL_ENTITIES.filter(e=>e.type!=='offering'&&/name to be chosen/i.test(e.name)).length);
 assert.ok(!claims.includes('Gemini'));assert.ok(claims.includes('Add Satellite'));
 const board=renderToStaticMarkup(<SpaceBoard entities={INITIAL_ENTITIES} onSelect={()=>{}} onUpdate={()=>{}}/>);
 assert.ok(board.includes('♊ Gemini'));assert.ok(board.includes('Shopify'));
});
test('CTA row consistently applies shared brand styling and honors local actions',()=>{
 const links=renderToStaticMarkup(<ActionPills/>);
 assert.equal((links.match(/lm-brand-cta/g)||[]).length,3);
 const actions=renderToStaticMarkup(<ActionPills onDesign={()=>{}} onWork={()=>{}} onPlay={()=>{}}/>);
 assert.equal((actions.match(/<button/g)||[]).length,3);assert.equal((actions.match(/<a /g)||[]).length,0);
});
