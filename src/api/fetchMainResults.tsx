import { fetchGoogleResults } from "./fetchGoogleResults";
import { fetchFoursquareResults } from "./fetchFoursquareResults";
import { searchResultType } from "../helpers/constants";
import { dedupResponses } from "../helpers/helperFns";
import { ApiError } from "../components/ApiError";

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
  let lastError = { status: "", message: "" };
  let nextGoogleToken = existingResults?.googleNextPage || "";
  let fourNextPage = existingResults?.fourNextPage || "";

  const results: any[] = existingResults?.places || [];

  // Return ALL results from Google before fetching foursquare results
  if (!fourNextPage && (nextResults === "initial" || nextGoogleToken)) {
    const googleResponse = await fetchGoogleResults(
      name,
      location,
      nextResults,
      existingResults,
    );
    if (googleResponse.error) {
      lastError = {
        status: `${googleResponse?.error.statusText}`,
        message: `${googleResponse?.error.status}`,
      };
    } else {
      results.push(...(googleResponse.places || []));
      nextGoogleToken = googleResponse.nextPage || "";
    }
  }

  /*
  If the results returned from the Google Response
  are less than the max and does not have next page token,
  fetch more by calling Foursquare
  */
  if (!nextGoogleToken || lastError?.status.length) {
    const fsResults = await fetchFoursquareResults(
      name,
      location,
      existingResults,
    );
    if (fsResults.error) {
      lastError = {
        status: `${fsResults?.error.status}`,
        message: `${fsResults.error.statusText}`,
      };
    } else {
      results.push(...(fsResults.places || []));
      fourNextPage = fsResults.fourNextPage || "";
    }
  }

  const combinedResults = dedupResponses(results);

  if (lastError?.status.length && combinedResults.length === 0) {
    throw new ApiError(+lastError.status, lastError.message);
  }

  setIsEmpty(combinedResults.length === 0);

  return {
    places: combinedResults,
    googleNextPage: nextGoogleToken,
    fourNextPage,
  };
};
