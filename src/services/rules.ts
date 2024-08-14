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

export const urlFriendlyStringRule = (val: string): true | string => {
  const pattern = /^[a-zA-Z0-9_-]+$/;
  return pattern.test(val) || 'Only alphanumeric characters, hyphens, and underscores are allowed.';
};
