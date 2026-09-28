import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import SpaceBoard from '../src/components/SpaceBoard';
import {INITIAL_ENTITIES} from '../src/constants';
import {matchPlatform} from '../src/components/PlatformIcon';

test('Plan board keeps exactly sixteen plan destinations and preserves Queen separately',()=>{
 const markup=renderToStaticMarkup(<SpaceBoard entities={INITIAL_ENTITIES} onSelect={()=>{}} onUpdate={()=>{}}/>);
 assert.equal((markup.match(/class="lm-plan-open"/g)||[]).length,16);
 assert.ok(markup.includes('Queen — view or assign person'));
 assert.ok(!markup.includes('53 named'));
});
test('unrelated platforms never borrow a misleading logo',()=>{
 assert.equal(matchPlatform('Claude'),null);
 assert.equal(matchPlatform('GoHighLevel CRM'),null);
 assert.equal(matchPlatform('Canva'),'canva');
 assert.equal(matchPlatform('Composio'),'composio');
});

import LorraineMadreChat from '../src/components/LorraineMadreChat';
import WelcomeJourney from '../src/components/WelcomeJourney';
import EngineJourney,{ENGINE_CATEGORIES} from '../src/components/EngineJourney';
test('Hero conversation keeps the two requested questions and optional work cues',()=>{
 const html=renderToStaticMarkup(<LorraineMadreChat/>);
 assert.ok(html.includes('What do you wish for today?'));
 assert.ok(html.includes('How do you feel about it?'));
 assert.ok(html.includes('WISH WELL cues'));
 assert.ok(html.includes('Connect a Satellite'));
});
test('journey keeps fourteen day markers without imposing the rejected questionnaire',()=>{
 const html=renderToStaticMarkup(<WelcomeJourney day={0} setDay={()=>{}}/>);
 assert.equal((html.match(/aria-label="Day /g)||[]).length,14);
 assert.ok(!html.includes('What would you like to become possible?'));
 const engine=renderToStaticMarkup(<EngineJourney/>);
 assert.equal(ENGINE_CATEGORIES.length,6);
 for(const name of ['Sunshine Pocket Therapy','WealthCounsel','On my way!','Sanctuary Cell','The Cookbook','Soup Club']) assert.ok(engine.includes(name));
});
