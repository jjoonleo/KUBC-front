import { Event, MenuType } from "../entities/event";

export interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrev?: boolean;
  } | null;
}

export interface EventFormData {
  dateTime: string;
  menuId: MenuType;
  place: string;
  maxParticipants: number;
  subject: string;
  content: string;
  uploadAt: string;
  confirmedMemberAt: string;
}

export interface EventCreateRequest {
  dateTime: string;
  menuId: MenuType;
  place: string;
  maxParticipants: number;
  subject: string;
  content: string;
  uploadAt: Date;
  confirmedMemberAt: Date;
  cafeArticleId?: number;
}
