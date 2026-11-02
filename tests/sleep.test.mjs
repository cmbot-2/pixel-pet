import assert from 'node:assert/strict';
import test from 'node:test';
import { createPet, feedPet, playWithPet, recoverEnergy, sleepPet, wakePet } from '../.test-build/care.js';

test('sleep restores five energy per full second, capped at 100 with other needs unchanged', () => {
  const initial = createPet();
  let pet = sleepPet(initial);
  assert.equal(pet.sleeping, true);
  assert.equal(initial.sleeping, false);
  pet = recoverEnergy(pet, 2);
  assert.equal(pet.energy, 90);
  pet = recoverEnergy(pet, 100000);
  assert.deepEqual(pet, { hunger: 65, happiness: 50, energy: 100, sleeping: true });
  assert.equal(sleepPet(pet), pet);
  assert.equal(recoverEnergy(pet, 1), pet);
});

test('sleep blocks snacks and play; waking restores access and stops energy recovery', () => {
  const sleeping = sleepPet({ ...createPet(), energy: 0 });
  assert.equal(feedPet(sleeping), sleeping);
  assert.deepEqual(playWithPet(sleeping), { pet: sleeping, played: false });
  const rested = recoverEnergy(sleeping, 2);
  assert.deepEqual(playWithPet(rested), { pet: rested, played: false });
  const awake = wakePet(rested);
  assert.equal(awake.energy, 10);
  assert.equal(awake.sleeping, false);
  assert.equal(wakePet(awake), awake);
  assert.equal(recoverEnergy(awake, 100), awake);
  assert.equal(playWithPet(awake).played, true);
  assert.equal(feedPet(awake).hunger, 45);
});

test('subsecond and invalid time do not award energy; restarting sleep alone adds nothing', () => {
  let pet = sleepPet(createPet());
  for (const seconds of [0, .99, -1, NaN, Infinity]) assert.equal(recoverEnergy(pet, seconds), pet);
  for (let index = 0; index < 10; index++) pet = sleepPet(wakePet(pet));
  assert.equal(pet.energy, 80);
  assert.equal(recoverEnergy(pet, 1.9).energy, 85);
});
