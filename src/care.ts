export type Pet = { hunger: number; happiness: number; energy: number; sleeping: boolean };
export const playHappiness = 15;
export const playEnergy = 10;
export const sleepEnergyPerSecond = 5;
export const maxElapsedSeconds = 5 * 60;
export const hungerPerSecond = 2 / 60;
export const happinessPerSecond = 1 / 60;
export const awakeEnergyPerSecond = 1 / 60;

export function createPet(): Pet {
  return { hunger: 65, happiness: 50, energy: 80, sleeping: false };
}

export function feedPet(pet: Pet): Pet {
  if (pet.sleeping) return pet;
  return { ...pet, hunger: Math.max(0, pet.hunger - 20) };
}

export function playWithPet(pet: Pet): { pet: Pet; played: boolean } {
  if (pet.sleeping || pet.energy < playEnergy) return { pet, played: false };
  return {
    pet: { ...pet, happiness: Math.min(100, pet.happiness + playHappiness), energy: pet.energy - playEnergy },
    played: true,
  };
}

export function sleepPet(pet: Pet): Pet {
  return pet.sleeping ? pet : { ...pet, sleeping: true };
}

export function wakePet(pet: Pet): Pet {
  return pet.sleeping ? { ...pet, sleeping: false } : pet;
}

export function advanceNeeds(pet: Pet, seconds: number): Pet {
  if (!Number.isFinite(seconds) || seconds <= 0) return pet;
  const elapsed = Math.min(seconds, maxElapsedSeconds);
  return {
    ...pet,
    hunger: Math.min(100, pet.hunger + elapsed * hungerPerSecond),
    happiness: Math.max(0, pet.happiness - elapsed * happinessPerSecond),
    energy: pet.sleeping
      ? Math.min(100, pet.energy + elapsed * sleepEnergyPerSecond)
      : Math.max(0, pet.energy - elapsed * awakeEnergyPerSecond),
  };
}
