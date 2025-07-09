import { Event } from "../entities/event";

export interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

export interface EventFormData {
  dateTime: string;
  menuId: number;
  place: string;
  maxParticipants: number;
  subject: string;
  content: string;
}

export interface EventCreateRequest {
  dateTime: string;
  menuId: number;
  place: string;
  maxParticipants: number;
  subject: string;
  content: string;
}
