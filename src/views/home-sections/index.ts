import { HomeView } from '@slack/bolt';
import { Event } from '../../models/event';
import { generateHomeGameListView } from './game-list';
import { homeHeaderView } from './header';

export function generateHomeView(isAdmin: boolean, events: Event[]): HomeView {
  const homeView: HomeView = {
    type: 'home',
    blocks: homeHeaderView,
  };

  if (isAdmin) {
    homeView.blocks.push(...homeHeaderView);
  }

  homeView.blocks.push(...generateHomeGameListView(events));

  return homeView;
}
