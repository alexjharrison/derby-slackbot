export function capitalize(sentence: string): string {
  return sentence
    .split(' ')
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .filter(word => word !== undefined)
    .join(' ');
}
