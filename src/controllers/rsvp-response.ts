import {
  App,
  Middleware,
  SlackAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import { RsvpStatus } from '../config/constants';
import { fetchUserByUid, updateRSVP } from '../models/user/user.service';
import { generateHomeView } from '../views/home-sections';

type ActionFn = Middleware<SlackActionMiddlewareArgs<SlackAction>>;

export function handleRSVPResponse(app: App) {
  app.action('rsvp_response_accepted', saveRSVP('accepted'));
  app.action('rsvp_response_rejected', saveRSVP('rejected'));
  app.action('rsvp_response_unsure', saveRSVP('unsure'));
}

function saveRSVP(rsvpStatus: RsvpStatus): ActionFn {
  return async ({ client, body, ack, payload }) => {
    await ack();
    if (
      payload.type !== 'button' ||
      !('action_ts' in payload) ||
      !('trigger_id' in body)
    )
      return;
    const uid = body.user.id;
    const eventId = Number(payload.value);
    if (!eventId) return;

    const me = fetchUserByUid(uid);
    await updateRSVP(eventId, rsvpStatus, me);

    client.views.publish({
      user_id: uid,
      view: await generateHomeView(),
    });
  };
}
