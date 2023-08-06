import { HomeView } from "@slack/bolt";
import { eventTypeWithAll } from "../../config/constants";
import { paddingView } from "../padding";
import { userStore } from "../../models/user/user.store";

export const eventTypeFilter = (): HomeView['blocks'] => [
    paddingView,
    {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": "*Filter by event type*"
        },
        "accessory": {
            "type": "static_select",
            "action_id": "select_event_filter",
            "placeholder": {
                "type": "plain_text",
                "text": "All",
                "emoji": true
            },
            initial_option: {
                value: userStore.currentUser.selected_event_filter,
                text: {
                    text: eventTypeWithAll[userStore.currentUser.selected_event_filter],
                    type: "plain_text"
                },
            },
            "options": Object.entries(eventTypeWithAll).map(([id, text]) => ({
                value: id,
                text: {
                    text, type: "plain_text", emoji: true
                },
            })),
        }
    },
    paddingView,
]