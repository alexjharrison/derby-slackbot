export function capitalize(sentence: string): string {
  return sentence
    .trim()
    .split(' ')
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}
