export const required = () => (v: any) => !!v || 'Required Field';

export function charLengthRule(maxLength: number) {
  return (value: string) => {
    if (!value) { return true; }
    if (value.length <= maxLength) {
      return true;
    }
    return `Only ${maxLength} characters allowed.`;
  };
}
