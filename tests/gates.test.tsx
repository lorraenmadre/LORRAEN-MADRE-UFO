import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GATES,freshGates,gateProgress,readGates} from '../src/gates';
import {GateTree} from '../src/components/GateOnboarding';
import ClaimSections from '../src/components/ClaimSections';
import GateOnboarding from '../src/components/GateOnboarding';
import {INITIAL_ENTITIES} from '../src/constants';
test('14-part WISH WELL map has unique keys and starts with intention, not mandatory disclosure',()=>{
 assert.equal(GATES.length,14);assert.equal(new Set(GATES.map(g=>g.key)).size,14);assert.equal(freshGates().selected,'6');
 const html=renderToStaticMarkup(<GateTree state={freshGates()} onSelect={()=>{}}/>);
 assert.equal((html.match(/aria-pressed=/g)||[]).length,14);
 assert.ok(GATES[0].context.includes('never require trauma disclosure'));
});
test('gate progress distinguishes opening, recorded words, and review and survives serialization',()=>{
 assert.equal(gateProgress(),0);
 assert.equal(gateProgress({opened:true,wish:'',feeling:''}),15);
 const recorded={opened:true,wish:'A calmer morning',feeling:'Hopeful',history:[{wish:'A calmer morning',feeling:'Hopeful',at:'now'}]};
 assert.equal(gateProgress(recorded),60);assert.equal(gateProgress({...recorded,reviewed:true}),100);
 const state={...freshGates(),selected:'12',records:{6:{...recorded,reviewed:true}}};
 assert.deepEqual(readGates(JSON.stringify(state)),state);
 assert.deepEqual(readGates('{broken'),freshGates());
});
test('every founder planet, dinosaur, satellite and the mothership is listed once with no emoji-style glyphs',()=>{
 const html=renderToStaticMarkup(<ClaimSections entities={INITIAL_ENTITIES} onSelect={()=>{}} onUpdate={()=>{}} onAddSatellite={()=>{}}/>);
 for(const e of INITIAL_ENTITIES.filter(e=>e.type!=='offering'&&e.name&&!/name to be chosen/i.test(e.name)))assert.ok(html.includes(e.name.replace(/&/g,'&amp;').replace(/'/g,'&#x27;')),e.name);
 for(const sign of ['Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces','Aries','Taurus'])assert.ok(html.includes(sign),sign);
 assert.ok(!/[\u2648-\u2653](?!\ufe0e)/.test(html),'zodiac glyph without text style');
 assert.equal((html.match(/lm-empty-card/g)||[]).length,3);
});
test('dots carry the gate colors and the Motherboard intro gives instructions',()=>{
 const html=renderToStaticMarkup(<GateOnboarding scope="t"/>);
 assert.ok(html.includes('YOUR MOTHERBOARD'));assert.ok(html.includes('Click a circle on the Tree of Life'));
 for(const c of ['#c8312b','#2e7d4f','#e8c21a','#7a4b26','#6d3a99','#ff2fb3','#d6d6d6','#4d4d4d','#f28c28','#1d4ed8','#f4f000','#00d5ff'])assert.ok(html.includes(`background:${c}`),c);
});
