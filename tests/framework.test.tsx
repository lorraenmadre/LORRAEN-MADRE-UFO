import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { INITIAL_ENTITIES, CLEAN_ENTITIES } from '../src/constants';
import CleanOutline from '../src/components/CleanOutline';
import OrbitMap from '../src/components/OrbitMap';

test('clean framework retains every workspace without founder content', () => {
  assert.deepEqual(CLEAN_ENTITIES.map(e => e.id), INITIAL_ENTITIES.map(e => e.id));
  for (const entity of CLEAN_ENTITIES) {
    assert.equal(entity.name, '');
    assert.equal(entity.description, '');
    for (const key of ['platform', 'status', 'connectionMethod', 'leanValueCanvas', 'executiveSummary', 'logoUrl']) {
      assert.equal(entity[key as keyof typeof entity], undefined, `${entity.id}: ${key}`);
    }
  }
  const markup = renderToStaticMarkup(<CleanOutline entities={CLEAN_ENTITIES} onSelect={() => {}} />);
  assert.equal((markup.match(/<button /g) || []).length, INITIAL_ENTITIES.length);
  for (const section of ['Offering seeds', 'Satellites', 'Zodiac dinosaurs']) assert.ok(markup.includes(section));
  assert.ok(!markup.includes('Sterling Drive'));
  assert.ok(!markup.includes('Globe Life'));
});

test('editing a clean workspace cannot mutate the founder example', () => {
  const original = INITIAL_ENTITIES.find(e => e.id === 'sun')!.name;
  const edited = CLEAN_ENTITIES.map(e => e.id === 'sun' ? { ...e, name: 'Customer brand' } : e);
  assert.equal(edited.find(e => e.id === 'sun')!.name, 'Customer brand');
  assert.equal(INITIAL_ENTITIES.find(e => e.id === 'sun')!.name, original);
});

test('orbit navigation renders every category and pause control', () => {
  const markup = renderToStaticMarkup(<OrbitMap entities={INITIAL_ENTITIES} onSelect={() => {}} />);
  assert.ok(markup.includes('Pause orbits'));
  for (const entity of INITIAL_ENTITIES) assert.ok(markup.includes(entity.symbol || entity.zodiacSign || entity.house || entity.type.replaceAll('_', ' ')), entity.id);
});
