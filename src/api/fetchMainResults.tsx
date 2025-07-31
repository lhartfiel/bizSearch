import { fetchGoogleResults } from "./fetchGoogleResults";
import { fetchFoursquareResults } from "./fetchFoursquareResults";
import { searchResultType } from "../helpers/constants";
import { dedupResponses } from "../helpers/helperFns";

/**
 * fetchMainResults
 *
 * This function is cumulative:
 * - It always merges existing results with newly fetched results
 * - Deduplicates merged results
 * - Returns a full combined dataset on every call
 */

export const fetchMainResults = async (
  name: string,
  location: string,
  nextResults: string,
  existingResults: searchResultType | undefined,
  setIsEmpty: (value: boolean) => void,
) => {
  let combinedResults = existingResults?.places || [];
  let nextGoogleToken = existingResults?.googleNextPage || "";
  let fourNextPage = existingResults?.fourNextPage || "";
  let fourSquareResults = [];

  // Return ALL results from Google before fetching foursquare results
  if (!fourNextPage && (nextResults === "initial" || nextGoogleToken)) {
    const googleResponse = await fetchGoogleResults(
      name,
      location,
      nextResults,
      existingResults,
    );
    combinedResults = dedupResponses([
      ...combinedResults,
      ...(googleResponse.places || []),
    ]);
    nextGoogleToken = googleResponse.nextPage || "";
    if (!googleResponse.nextPage) {
      nextGoogleToken = "";
    }
  }

  /*
  If the results returned from the Google Response
  are less than the max and does not have next page token,
  fetch more by calling Foursquare
  */
  if (!nextGoogleToken) {
    const fsResults = await fetchFoursquareResults(
      name,
      location,
      existingResults,
    );
    fourSquareResults = fsResults.places || [];
    fourNextPage = fsResults.fourNextPage || "";
    combinedResults = dedupResponses([
      ...combinedResults,
      ...fourSquareResults,
    ]);
  }

  const resultState = {
    places: combinedResults,
    googleNextPage: nextGoogleToken,
    fourNextPage,
  };

  if (combinedResults.length === 0) {
    setIsEmpty(true);
  } else {
    setIsEmpty(false);
  }

  return resultState;
};
