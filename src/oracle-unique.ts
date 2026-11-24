const ORA_UNIQUE_CONSTRAINT = 1;

export function isUniqueViolation(error: unknown): boolean {
  const candidates = [error, (error as { driverError?: unknown } | null)?.driverError];
  return candidates.some(
    (candidate) => (candidate as { errorNum?: number } | null)?.errorNum === ORA_UNIQUE_CONSTRAINT,
  );
}
