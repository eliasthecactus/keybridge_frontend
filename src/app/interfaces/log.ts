export interface Log {
  id: number;
  timestamp: Date; // ISO 8601 string for the event time (e.g., "2024-12-13T14:00:00Z")
  level: string; // Log level (e.g., "INFO", "ERROR", "DEBUG")
  message: string; // Short description or message of the log
  data?: any; // Optional additional data related to the event
}
