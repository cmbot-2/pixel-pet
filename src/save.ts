import { createPet } from './care.js';
import { advanceCare } from './elapsed.js';
import type { CareState } from './elapsed.js';

export const saveKey = 'pixel-pet:care';
type RestoredCare = { state: CareState; status: 'new' | 'restored' | 'invalid' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNeed(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;
}

export function restoreCare(raw: string | null, now: number): RestoredCare {
  const fresh: CareState = { pet: createPet(), updatedAt: now };
  if (raw === null) return { state: fresh, status: 'new' };
  try {
    const saved: unknown = JSON.parse(raw);
    if (isRecord(saved) && saved.version === 1 && isRecord(saved.pet)
      && typeof saved.updatedAt === 'number' && Number.isFinite(saved.updatedAt)
      && saved.updatedAt >= 0 && saved.updatedAt <= 8.64e15) {
      const { hunger, happiness, energy, sleeping } = saved.pet;
      if (isNeed(hunger) && isNeed(happiness) && isNeed(energy) && typeof sleeping === 'boolean') {
        // A clock correction between visits must not freeze care into the future.
        const state = { pet: { hunger, happiness, energy, sleeping }, updatedAt: Math.min(now, saved.updatedAt) };
        return { state: advanceCare(state, now), status: 'restored' };
      }
    }
  } catch { /* A broken save starts a fresh visit. */ }
  return { state: fresh, status: 'invalid' };
}

export function serializeCare(state: CareState): string {
  return JSON.stringify({ version: 1, pet: state.pet, updatedAt: state.updatedAt });
}
