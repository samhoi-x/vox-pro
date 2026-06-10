// Time-based free trial: 72 hours from first dashboard access.
export const TRIAL_HOURS = 72;

export function getTrialEnd(startedAt: string): Date {
  return new Date(new Date(startedAt).getTime() + TRIAL_HOURS * 60 * 60 * 1000);
}

export function isTrialExpired(startedAt: string | null): boolean {
  if (!startedAt) return false;
  return new Date() > getTrialEnd(startedAt);
}
