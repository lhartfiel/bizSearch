import { fetchGoogleResults } from "./fetchGoogleResults";
import { fetchFoursquareResults } from "./fetchFoursquareResults";
import { MAX_RESULTS } from "../helpers/constants";
import { Dispatch } from "react";
import { searchResultType } from "../helpers/constants";

export const fetchMainResults = async (
  name: string,
  location: string,
  nextResults: string,
  dispatch: Dispatch<any>,
  searchResults: searchResultType,
  setIsEmpty: (value: boolean) => void,
) => {
  const googleResults = await fetchGoogleResults(
    name,
    location,
    nextResults,
    searchResults,
  );

  if (dispatch)
    dispatch({
      type: "update result",
      places: googleResults.googleNewObj || [],
      next: googleResults.googleJson.nextPageToken,
      fourNextPage: "",
    });

  // If the results returned from the Google Response are less than the max and does not have next page token, fetch more by calling Foursquare
  let foursquareResults: any[] = [];
  if (
    googleResults?.googleNewObj?.length < MAX_RESULTS &&
    !googleResults.googleJson.nextPageToken
  ) {
    foursquareResults = await fetchFoursquareResults(name, location, dispatch);
  }

  if (
    (googleResults.googleNewObj?.length ?? 0) === 0 &&
    (foursquareResults?.length ?? 0) === 0
  ) {
    setIsEmpty(true);
  } else {
    setIsEmpty(false);
  }
};
