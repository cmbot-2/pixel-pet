import assert from 'node:assert/strict';
import test from 'node:test';
import { createPet, feedPet, playWithPet, sleepPet } from '../.test-build/care.js';
import { advanceCare } from '../.test-build/elapsed.js';
import { restoreCare, serializeCare } from '../.test-build/save.js';

test('a versioned save restores care actions, fractional needs, and sleep state', () => {
  const state = { pet: sleepPet(playWithPet(feedPet(createPet())).pet), updatedAt: 1000 };
  state.pet.hunger += .25;
  const encoded = serializeCare(state);
  assert.equal(JSON.parse(encoded).version, 1);
  assert.deepEqual(restoreCare(encoded, 1000), { state, status: 'restored' });
  assert.deepEqual(restoreCare(encoded, 3000).state, advanceCare(state, 3000));
});

test('reload applies bounded time away once and persists the new baseline', () => {
  for (const sleeping of [false, true]) {
    const start = { pet: { ...createPet(), sleeping }, updatedAt: 1000 };
    const later = 86401000;
    const loaded = restoreCare(serializeCare(start), later);
    assert.deepEqual(loaded.state.pet, { hunger: 75, happiness: 45, energy: sleeping ? 100 : 75, sleeping });
    assert.equal(loaded.state.updatedAt, later);
    const reloaded = restoreCare(serializeCare(loaded.state), later);
    assert.deepEqual(reloaded, loaded);
    assert.deepEqual(restoreCare(serializeCare(reloaded.state), later + 60000).state, advanceCare(loaded.state, later + 60000));
  }
});

test('missing, corrupt, unsupported, and malformed saves recover to a fresh pet', () => {
  const valid = { version: 1, pet: createPet(), updatedAt: 1000 };
  const fresh = { pet: createPet(), updatedAt: 2000 };
  assert.deepEqual(restoreCare(null, 2000), { state: fresh, status: 'new' });
  const broken = ['', '{', 'null', '[]', 'false', '42', '{}', JSON.stringify({ ...valid, version: 2 })];
  for (const updatedAt of [-1, null, '1000', 9e15]) broken.push(JSON.stringify({ ...valid, updatedAt }));
  broken.push('{"version":1,"pet":{"hunger":65,"happiness":50,"energy":80,"sleeping":false},"updatedAt":1e999}');
  for (const field of ['hunger', 'happiness', 'energy']) {
    for (const value of [-.01, 100.01, null, '50', undefined]) broken.push(JSON.stringify({ ...valid, pet: { ...valid.pet, [field]: value } }));
  }
  for (const pet of [null, [], {}, { ...valid.pet, sleeping: 'false' }]) broken.push(JSON.stringify({ ...valid, pet }));
  for (const raw of broken) assert.deepEqual(restoreCare(raw, 2000), { state: fresh, status: 'invalid' });
});

test('a future save timestamp is rebased without changing needs or blocking later care', () => {
  const initial = createPet();
  const loaded = restoreCare(serializeCare({ pet: initial, updatedAt: 86400000 }), 1000);
  assert.deepEqual(loaded.state, { pet: initial, updatedAt: 1000 });
  assert.equal(advanceCare(loaded.state, 61000).pet.hunger, 67);
});
