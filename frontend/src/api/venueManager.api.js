import SERVER_API from "./server.api.js";

export const registerVenueManager = `${SERVER_API}/venueManagers/register`;
export const loginVenueManager = `${SERVER_API}/venueManagers/login`;
export const logoutVenueManager = `${SERVER_API}/venueManagers/logout`;
export const currentVenueManager = `${SERVER_API}/venueManagers/current-user`;
export const updateVenueManagerDetails = `${SERVER_API}/venueManagers/update-details`;
