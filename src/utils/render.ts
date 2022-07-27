import { HomeView } from '@slack/bolt';

export function render(
  type: HomeView['type'],
  ...blocks: HomeView['blocks'][]
): HomeView {
  const page: HomeView['blocks'] = [];

  for (const block of blocks) {
    page.push(...block);
  }

  return {
    type,
    blocks: page,
  };
}
