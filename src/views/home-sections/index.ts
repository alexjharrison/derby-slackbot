import { HomeView } from '@slack/bolt';
import {
  fetchPastEvents,
  fetchUpcomingEvents,
} from '../../models/event/event.service';
import { render } from '../../utils/render';
import { homeAdminView } from './admin';
import { generateEventList } from './events';
import { homeHeaderView } from './header';

export async function generateHomeView(isAdmin: boolean): Promise<HomeView> {
  const futureEvents = await fetchUpcomingEvents();
  const pastEvents = await fetchPastEvents();

  return isAdmin
    ? render(
        'home',
        homeHeaderView,
        homeAdminView,
        generateEventList('Upcoming Events', futureEvents),
        generateEventList('Past Events', pastEvents)
      )
    : render(
        'home',
        homeHeaderView,
        generateEventList('Upcoming Events', futureEvents),
        generateEventList('Past Events', pastEvents)
      );
}