import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "../../types/entities/event";
import { EventsState } from "../../types/dtos/event";
import { EventService } from "../../services/eventService";

// Re-export for backward compatibility
export type { Event };

// Async thunk for fetching events with pagination
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (params: { page?: number; limit?: number } = {}) => {
    const { page = 1, limit = 10 } = params;
    const response = await EventService.getEvents(page, limit);
    return response;
  }
);

// Async thunk for fetching a single event by ID
export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id: string) => {
    const event = await EventService.getEventById(id);
    return event;
  }
);

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  pagination: null,
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
      // Update pagination total if pagination exists
      if (state.pagination) {
        state.pagination.total += 1;
      }
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
      // Update current event if it's the same event
      if (state.currentEvent?.id === action.payload.id) {
        state.currentEvent = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      state.events = state.events.filter(
        (event) => event.id !== action.payload
      );
      // Update pagination total if pagination exists
      if (state.pagination) {
        state.pagination.total -= 1;
      }
      // Clear current event if it's the deleted event
      if (state.currentEvent?.id === action.payload) {
        state.currentEvent = null;
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearEvents: (state) => {
      state.events = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events cases
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch events";
      })
      // Fetch event by ID cases
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
        state.error = null;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch event";
      });
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
  clearEvents,
} = eventsSlice.actions;

export default eventsSlice.reducer;
