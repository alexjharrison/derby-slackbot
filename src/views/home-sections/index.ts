import { HomeView } from '@slack/bolt';
import {
  fetchPastEvents,
  fetchUpcomingEvents,
} from '../../models/event/event.service';
import { userStore } from '../../models/user/user.store';
import { render } from '../../utils/render';
import { homeAdminView } from './admin';
import { generateEventList } from './events';
import { homeHeaderView } from './header';
import { eventTypeFilter } from './filter';

export async function generateHomeView(): Promise<HomeView> {
  const futureEvents = await fetchUpcomingEvents();
  const pastEvents = await fetchPastEvents(40 - futureEvents.length);
  const { is_admin } = userStore.currentUser;

  return is_admin
    ? render(
      'home',
      homeHeaderView,
      homeAdminView,
      eventTypeFilter(),
      generateEventList('Upcoming Events', futureEvents),
      // generateEventList('Past Events', pastEvents)
    )
    : render(
      'home',
      homeHeaderView,
      eventTypeFilter(),
      generateEventList('Upcoming Events', futureEvents),
      // generateEventList('Past Events', pastEvents)
    );
}
