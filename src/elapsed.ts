import { advanceNeeds } from './care.js';
import type { Pet } from './care.js';

export type CareState = { pet: Pet; updatedAt: number };

export function advanceCare(state: CareState, now: number): CareState {
  if (!Number.isFinite(now) || now <= state.updatedAt) return state;
  return {
    pet: advanceNeeds(state.pet, (now - state.updatedAt) / 1000),
    // Consume the entire gap, including time beyond the cap, exactly once.
    updatedAt: now,
  };
}
