import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {GATES,freshGates,gateProgress,readGates} from '../src/gates';
import {GateTree} from '../src/components/GateOnboarding';
import {boardCells} from '../src/checkerboard';
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
test('board groups two rows each, leaves product Houses to the Mothership and loses no founder entry',()=>{
 const cells=boardCells(INITIAL_ENTITIES);assert.equal(cells.length,48);
 for(let i=0;i<48;i++)assert.equal(cells[i].group,['Planets','Dinosaurs','Connections'][Math.floor(i/16)]);
 assert.equal(cells.slice(0,16).filter(c=>c.entity).length,16);
 assert.equal(cells.slice(16,32).filter(c=>c.entity).length,12);
 const ids=cells.flatMap(c=>c.entity?[c.entity.id]:[]);assert.equal(new Set(ids).size,ids.length);
 assert.deepEqual(new Set(ids),new Set(INITIAL_ENTITIES.filter(e=>e.type!=='offering').map(e=>e.id)));
});
