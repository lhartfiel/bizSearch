export interface searchResultType {
  places: any[];
  next: string;
  fourNextPage: string;
}

export interface googlePlaceType {
  formattedAddress: string;
  googleMapsLinks: {
    directionsUri: string;
  };
  displayName: {
    text: string;
  };
  nationalPhoneNumber: string;
  priceRange: string;
  rating: number | string;
  userRatingCount: number;
  generativeSummary: {
    overview: {
      text: string;
    };
  };
  websiteUri: string;
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
  next: "",
  fourNextPage: "",
};
