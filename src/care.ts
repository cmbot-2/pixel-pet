export type Pet = { hunger: number; happiness: number; energy: number; sleeping: boolean };
export const playHappiness = 15;
export const playEnergy = 10;
export const sleepEnergyPerSecond = 5;

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

export function recoverEnergy(pet: Pet, seconds: number): Pet {
  if (!pet.sleeping || pet.energy === 100 || !Number.isFinite(seconds) || seconds < 1) return pet;
  return { ...pet, energy: Math.min(100, pet.energy + Math.floor(seconds) * sleepEnergyPerSecond) };
}
