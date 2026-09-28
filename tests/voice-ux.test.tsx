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
