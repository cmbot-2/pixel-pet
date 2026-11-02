import assert from 'node:assert/strict';
import test from 'node:test';
import { createPet, advanceNeeds, sleepPet, wakePet, feedPet, playWithPet } from '../.test-build/care.js';
import { advanceCare } from '../.test-build/elapsed.js';

test('needs depend on elapsed time rather than update frequency, including fractional seconds', () => {
  for (const initial of [createPet(), sleepPet(createPet())]) {
    const whole = advanceNeeds(initial, 120);
    let steps = initial;
    for (let index = 0; index < 480; index++) steps = advanceNeeds(steps, .25);
    for (const need of ['hunger', 'happiness', 'energy']) assert(Math.abs(steps[need] - whole[need]) < 1e-9);
  }
  assert.deepEqual(advanceNeeds(createPet(), 60), { hunger: 67, happiness: 49, energy: 79, sleeping: false });
});

test('a long gap applies at most five minutes and discards excess time without a second catch-up', () => {
  const start = { pet: createPet(), updatedAt: 1000 };
  const dayLater = 86401000;
  const away = advanceCare(start, dayLater);
  assert.deepEqual(away.pet, { hunger: 75, happiness: 45, energy: 75, sleeping: false });
  assert.equal(away.updatedAt, dayLater);
  assert.equal(advanceCare(away, dayLater), away);
  assert.deepEqual(advanceCare(away, dayLater + 60000).pet,
    { hunger: 77, happiness: 44, energy: 74, sleeping: false });
  const asleep = advanceCare({ ...start, pet: sleepPet(start.pet) }, dayLater);
  assert.deepEqual(asleep.pet, { hunger: 75, happiness: 45, energy: 100, sleeping: true });
});

test('backward or invalid timestamps never reverse needs or recount time', () => {
  const start = { pet: createPet(), updatedAt: 1000 };
  for (const time of [NaN, Infinity, 0, 999, 1000]) assert.equal(advanceCare(start, time), start);
  const first = advanceCare(start, 2000);
  const backwards = advanceCare(first, 1500);
  assert.equal(backwards, first);
  const actual = advanceCare(backwards, 3000).pet;
  const expected = advanceNeeds(start.pet, 2);
  for (const need of ['hunger', 'happiness', 'energy']) assert(Math.abs(actual[need] - expected[need]) < 1e-9);
});

test('neglect remains bounded and care can always recover a hungry, tired pet', () => {
  let pet = createPet();
  for (let index = 0; index < 50; index++) pet = advanceNeeds(pet, 300);
  assert.deepEqual(pet, { hunger: 100, happiness: 0, energy: 0, sleeping: false });
  pet = advanceNeeds(sleepPet(pet), 20);
  assert.equal(pet.energy, 100);
  pet = feedPet(wakePet(pet));
  const result = playWithPet(pet);
  assert.equal(result.played, true);
  assert.deepEqual(result.pet, { hunger: 80, happiness: 15, energy: 90, sleeping: false });
});
