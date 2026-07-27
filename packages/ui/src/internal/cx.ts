/** Joins class names, dropping anything falsy. Not exported from the package. */
export function cx(...values: (string | false | null | undefined)[]): string {
  return values.filter(Boolean).join(' ');
}
