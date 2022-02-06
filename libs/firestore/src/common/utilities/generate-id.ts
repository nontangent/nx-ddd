interface Options {
  letters: boolean;
  upperCase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const defaultOptions: Options = {
  letters: true,
  upperCase: true,
  numbers: true,
  symbols: false,
}

const CHARACTERS = {
  letters: 'abcdefghijklmnopqrstuvwxyz',
  upperCase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!#$%&()',
};

const generateRandomString = (n: number, options: Options = defaultOptions): string => {
  const characters = Object.entries(CHARACTERS).filter(([k]) => options[k]).map(([_, v]) => v).join('');
  const genChar = (): string => characters.charAt(Math.floor(Math.random() * characters.length));

  return [...Array(n)].map(() => genChar()).join('');
}

export const generateId = (n: number = 20): string => generateRandomString(n);