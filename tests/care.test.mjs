import assert from 'node:assert/strict';
import test from 'node:test';
import { createPet, feedPet, playWithPet } from '../.test-build/care.js';

test('playing adds happiness, spends energy, and leaves hunger unchanged', () => {
  const pet = createPet();
  const result = playWithPet(pet);
  assert.equal(result.played, true);
  assert.deepEqual(result.pet, { hunger: 65, happiness: 65, energy: 70 });
  assert.deepEqual(pet, { hunger: 65, happiness: 50, energy: 80 });
  assert.deepEqual(playWithPet({ ...pet, happiness: 95, energy: 10 }).pet,
    { hunger: 65, happiness: 100, energy: 0 });
});

test('repeated play stops at exhaustion without extra rewards or negative energy', () => {
  let pet = createPet();
  for (let index = 0; index < 8; index++) {
    const result = playWithPet(pet);
    assert.equal(result.played, true);
    pet = result.pet;
    assert(pet.happiness <= 100 && pet.energy >= 0);
  }
  assert.deepEqual(pet, { hunger: 65, happiness: 100, energy: 0 });
  for (let index = 0; index < 20; index++) assert.deepEqual(playWithPet(pet), { pet, played: false });
  const tired = { ...pet, energy: 9, happiness: 40 };
  assert.deepEqual(playWithPet(tired), { pet: tired, played: false });
  assert.deepEqual(createPet(), { hunger: 65, happiness: 50, energy: 80 });
});

test('snacks bound hunger without changing happiness or replenishing energy', () => {
  let pet = playWithPet(createPet()).pet;
  for (let index = 0; index < 10; index++) pet = feedPet(pet);
  assert.deepEqual(pet, { hunger: 0, happiness: 65, energy: 70 });
});
