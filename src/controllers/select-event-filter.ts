import { App } from '@slack/bolt';
import { generateHomeView } from '../views/home-sections';
import { updateUserSelectedEventFilter } from '../models/user/user.service';
import { EventTypeWithAll } from '../config/constants';
import { userStore } from '../models/user/user.store';

export function selectEventFilter(app: App) {
    app.action(
        'select_event_filter',
        async ({ ack, payload, client, body }) => {
            await ack();
            if ("selected_option" in payload) {
                if (payload.selected_option && "value" in payload.selected_option) {

                    const eventTypeId = payload.selected_option.value as EventTypeWithAll

                    await updateUserSelectedEventFilter(eventTypeId)
                }

                const result = await client.views.publish({
                    user_id: body.user.id,
                    view: await generateHomeView(),
                });
            }
        }
    );
}

