const DAILY_LIMIT = 5;

interface CreditState {
  date: string;
  dailyUsed: number;
  purchasedCredits: number;
}

const getTodayString = () => new Date().toDateString();

// Helper to get the correct storage key based on user ID
const getStorageKey = (userId: string | null | undefined) => {
  return userId ? `monospace_credits_${userId}` : 'monospace_credits_guest';
};

export const getCreditState = (userId?: string | null): CreditState => {
  const key = getStorageKey(userId);
  const stored = localStorage.getItem(key);
  const today = getTodayString();
  
  if (!stored) {
    return { date: today, dailyUsed: 0, purchasedCredits: 0 };
  }

  const parsed: CreditState = JSON.parse(stored);

  // If it's a new day, reset daily usage but keep purchased credits
  if (parsed.date !== today) {
    const newState = {
      date: today,
      dailyUsed: 0,
      purchasedCredits: parsed.purchasedCredits
    };
    saveCreditState(newState, userId);
    return newState;
  }

  return parsed;
};

const saveCreditState = (state: CreditState, userId?: string | null) => {
  const key = getStorageKey(userId);
  localStorage.setItem(key, JSON.stringify(state));
};

export const canGenerate = (userId?: string | null): boolean => {
  const state = getCreditState(userId);
  return state.dailyUsed < DAILY_LIMIT || state.purchasedCredits > 0;
};

export const consumeCredit = (userId?: string | null): void => {
  const state = getCreditState(userId);
  
  if (state.dailyUsed < DAILY_LIMIT) {
    state.dailyUsed += 1;
  } else if (state.purchasedCredits > 0) {
    state.purchasedCredits -= 1;
  }
  
  saveCreditState(state, userId);
};

export const addCredits = (amount: number, userId?: string | null): void => {
  const state = getCreditState(userId);
  state.purchasedCredits += amount;
  saveCreditState(state, userId);
};

export const getRemainingFree = (userId?: string | null): number => {
  const state = getCreditState(userId);
  return Math.max(0, DAILY_LIMIT - state.dailyUsed);
};

export const getPurchasedBalance = (userId?: string | null): number => {
  const state = getCreditState(userId);
  return state.purchasedCredits;
};