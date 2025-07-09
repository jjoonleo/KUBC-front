import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "../../types/entities/event";
import { EventsState } from "../../types/dtos/event";

// Re-export for backward compatibility
export type { Event };

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    setCurrentEvent: (state, action: PayloadAction<Event | null>) => {
      state.currentEvent = action.payload;
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(
        (event) => event.id === action.payload.id
      );
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  addEvent,
  setEvents,
  setCurrentEvent,
  updateEvent,
  deleteEvent,
  setError,
  clearError,
} = eventsSlice.actions;

export default eventsSlice.reducer;
