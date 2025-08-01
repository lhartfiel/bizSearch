export interface searchResultType {
  places: any[];
  googleNextPage: string;
  fourNextPage: string;
}

export interface googlePlaceType {
  formatted_address: string;
  googleMapsLinks: {
    directionsUri: string;
  };
  name: {
    text: string;
  };
  phone: string;
  priceRange: string;
  rating: number | string;
  user_ratings_total: number;
  webUrl: string;
}

export interface foursquarePlaceType {
  name: string;
  location: {
    formatted_address: string;
  };
  tel: string;
  rating: number | string;
  website: string;
}

export const MAX_RESULTS = 25; // Max results per page
export const initialSearchResult: searchResultType = {
  places: [],
  googleNextPage: "",
  fourNextPage: "",
};
