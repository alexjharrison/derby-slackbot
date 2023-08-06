import { EventType } from "../config/constants";
import { Event } from "../models/event/event.interface";

export function capitalize(sentence: string): string {
  return sentence
    .trim()
    .split(' ')
    .map(word => word[0]?.toUpperCase() + word.slice(1))
    .join(' ');
}

export function emojifyTitle(event: Event): string {
  const emojiDict: Record<EventType, string> = {
    GAME: "🛼🛼",
    FUNDRAISER: "💸💸",
    PRACTICE: "",
    OTHER: "🤔🤔",
    SCRIMMAGE: "🤝🤝",
    SOCIAL: "🕺💃"
  }
  return `${emojiDict[event.event_type]} ${event.title}`
}