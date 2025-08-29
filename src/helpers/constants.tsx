export interface searchResultType {
  places?: any[];
  googleNextPage?: string;
  fourNextPage?: string;
}

export interface googlePlaceType {
  formattedAddress: string;
  googleMapsLinks: {
    directionsUri: string;
  };
  displayName: {
    text: string;
  };
  nationalPhoneNumber: string | null | undefined;
  rating: number | string;
  userRatingCount: number;
  websiteUri: string;
}

export interface foursquarePlaceType {
  name: string;
  location: {
    formatted_address: string;
  };
  tel: string | null | undefined;
  rating: number | string;
  website: string;
}

export interface searchResultPlacesType {
  address: string;
  name: string;
  phone?: string | null | undefined;
  price?: string;
  rating?: string;
  ratingCount?: number | undefined;
  webUrl?: string;
}

export interface fetchResponseType extends searchResultType {
  error?: { status: number; statusText: string };
}

export const MAX_RESULTS = 25; // Max results per page
export const initialSearchResult: searchResultType = {
  places: [],
  googleNextPage: "",
  fourNextPage: "",
};
