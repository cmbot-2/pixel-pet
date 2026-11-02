import assert from 'node:assert/strict';
import test from 'node:test';
import { createPet, feedPet, playWithPet, advanceNeeds, sleepPet, wakePet } from '../.test-build/care.js';

test('sleep restores five energy per second while hunger and happiness drift gently', () => {
  const initial = createPet();
  let pet = sleepPet(initial);
  assert.equal(pet.sleeping, true);
  assert.equal(initial.sleeping, false);
  pet = advanceNeeds(pet, 2);
  assert.equal(pet.energy, 90);
  assert(pet.hunger > 65 && pet.hunger < 66);
  assert(pet.happiness < 50 && pet.happiness > 49);
  pet = advanceNeeds(pet, 60);
  assert.equal(pet.energy, 100);
  assert.equal(pet.sleeping, true);
  assert.equal(sleepPet(pet), pet);
});

test('sleep blocks snacks and play; waking restores access and stops energy recovery', () => {
  const sleeping = sleepPet({ ...createPet(), energy: 0 });
  assert.equal(feedPet(sleeping), sleeping);
  assert.deepEqual(playWithPet(sleeping), { pet: sleeping, played: false });
  const rested = advanceNeeds(sleeping, 2);
  assert.deepEqual(playWithPet(rested), { pet: rested, played: false });
  const awake = wakePet(rested);
  assert.equal(awake.energy, 10);
  assert.equal(awake.sleeping, false);
  assert.equal(wakePet(awake), awake);
  assert.equal(advanceNeeds(awake, 60).energy, 9);
  assert.equal(playWithPet(awake).played, true);
  assert.equal(feedPet(awake).hunger, awake.hunger - 20);
});

test('fractional rest counts, invalid time does not, and sleep toggles alone add nothing', () => {
  let pet = sleepPet(createPet());
  for (const seconds of [0, -1, NaN, Infinity]) assert.equal(advanceNeeds(pet, seconds), pet);
  for (let index = 0; index < 10; index++) pet = sleepPet(wakePet(pet));
  assert.equal(pet.energy, 80);
  assert.equal(advanceNeeds(pet, .5).energy, 82.5);
});
