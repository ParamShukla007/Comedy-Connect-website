import SERVER_API from "./server.api.js";

export const createEvent = `${SERVER_API}/events/createEvent`;
export const getEventDetails = `${SERVER_API}/events/getEventDetails`;
export const approveEventByAdmin = `${SERVER_API}/events/approveEventByAdmin`;
export const approveEventByVenueManager = `${SERVER_API}/events/approveEventByVenueManager`;
export const rejectEvent = `${SERVER_API}/events/rejectEvent`;
export const getEventsByDate = `${SERVER_API}/events/getEventsByDate`;
export const filterEventsByType = `${SERVER_API}/events/filterEventsByType`;
export const getPendingEventsAdmin = `${SERVER_API}/events/getPendingEventsAdmin`;
export const getPendingEventsVenueManager = `${SERVER_API}/events/getPendingEventsVenueManager`;
export const getEventById = `${SERVER_API}/events/getEventById`;
export const proposeNegotiation = `${SERVER_API}/events/proposeNegotiation`;
export const respondToNegotiation = `${SERVER_API}/events/respondToNegotiation`;
export const getAllEvents = `${SERVER_API}/events/getAllEvents`;
