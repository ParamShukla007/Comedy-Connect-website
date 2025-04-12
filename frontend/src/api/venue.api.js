import SERVER_API from "./server.api.js";

export const registerVenue = `${SERVER_API}/venues/registerVenue`;//connected
export const approveVenue = `${SERVER_API}/venues/approveVenueByAdmin`;
export const verifyVenue = `${SERVER_API}/venues/verifyVenue`;
export const getAllVenues = `${SERVER_API}/venues/getAllVenues`;//connected
export const getPendingVenues = `${SERVER_API}/venues/getPendingVenues`;
export const bookVenue = `${SERVER_API}/venues/bookVenue`;
export const getSimilarVenues = `${SERVER_API}/venues/getSimilarVenues`;
export const rejectVenue = `${SERVER_API}/venues/rejectVenue`;
