export const TEAM_ID = 'T03REQ33JQ0';
export const EVENT_CHANNEL_ID = 'C03QTEX496G';

export type RsvpStatus = 'accepted' | 'rejected' | 'unsure';

export const eventType = {
    GAME: "Game / Scrimmage",
    FUNDRAISER: "Fundraiser",
    SOCIAL: "Social",
    OTHER: "Other"
} as const

export const eventTypeWithAll = {
    "ALL": "All",
    ...eventType,
} as const

export type EventType = keyof typeof eventType
export type EventTypeWithAll = keyof typeof eventTypeWithAll