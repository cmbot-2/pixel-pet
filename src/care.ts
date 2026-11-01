export type Pet = { hunger: number; happiness: number; energy: number };
export const playHappiness = 15;
export const playEnergy = 10;

export function createPet(): Pet {
  return { hunger: 65, happiness: 50, energy: 80 };
}

export function feedPet(pet: Pet): Pet {
  return { ...pet, hunger: Math.max(0, pet.hunger - 20) };
}

export function playWithPet(pet: Pet): { pet: Pet; played: boolean } {
  if (pet.energy < playEnergy) return { pet, played: false };
  return {
    pet: { ...pet, happiness: Math.min(100, pet.happiness + playHappiness), energy: pet.energy - playEnergy },
    played: true,
  };
}
