import { Block, KnownBlock } from '@slack/bolt';

declare global {
  type Blocks = (KnownBlock | Block)[];
}
