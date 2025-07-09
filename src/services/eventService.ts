import { apiClient } from "../utils/axios/apiClient";
import { Event } from "../store/slices/eventsSlice";
import {
  ApiResponse,
  PaginatedApiResponse,
  ApiResponseWrapper,
} from "../utils/apiResponse";

export interface EventCreateRequest {
  dateTime: string;
  menuId: number;
  place: string;
  maxParticipants: number;
  subject: string;
  content: string;
}

export type EventResponse = ApiResponse<Event>;
export type EventListResponse = PaginatedApiResponse<Event>;

export class EventService {
  static async createEvent(eventData: EventCreateRequest): Promise<Event> {
    try {
      const response = await apiClient.post<EventResponse>(
        "/api/events",
        eventData
      );

      const validatedResponse = ApiResponseWrapper.validateResponse<Event>(
        response.data
      );
      return validatedResponse.data;
    } catch (error) {
      console.error("Create event error:", error);
      throw error;
    }
  }

  static async getEvents(
    page: number = 1,
    limit: number = 10
  ): Promise<EventListResponse> {
    try {
      const response = await apiClient.get<EventListResponse>("/api/events", {
        params: { page, limit },
      });

      return ApiResponseWrapper.validatePaginatedResponse<Event>(response.data);
    } catch (error) {
      console.error("Get events error:", error);
      throw error;
    }
  }

  static async getEventById(id: string): Promise<Event> {
    try {
      const response = await apiClient.get<EventResponse>(`/api/events/${id}`);

      const validatedResponse = ApiResponseWrapper.validateResponse<Event>(
        response.data
      );
      return validatedResponse.data;
    } catch (error) {
      console.error("Get event error:", error);
      throw error;
    }
  }

  static async updateEvent(
    id: string,
    eventData: Partial<EventCreateRequest>
  ): Promise<Event> {
    try {
      const response = await apiClient.put<EventResponse>(
        `/api/events/${id}`,
        eventData
      );

      const validatedResponse = ApiResponseWrapper.validateResponse<Event>(
        response.data
      );
      return validatedResponse.data;
    } catch (error) {
      console.error("Update event error:", error);
      throw error;
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/events/${id}`);

      if (response.status !== 200 && response.status !== 204) {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Delete event error:", error);
      throw error;
    }
  }
}
