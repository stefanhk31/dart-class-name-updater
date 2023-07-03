export const inputToPascalCase = (input: string) => {
  const casing = require('case');

  const hasSpaces = /\s/g.test(input);

  if (hasSpaces) {
    return input.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  }
  
    return casing.pascal(input);
  };