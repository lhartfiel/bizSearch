import { memo } from "react";
import parsePhoneNumber, { parse } from "libphonenumber-js";
import { searchResultPlacesType } from "../helpers/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { Ratings } from "./Ratings";
import { InfoBox } from "./InfoBox";
import { isTouchDevice } from "../helpers/utils";

const webIcon = (
  <FontAwesomeIcon icon={faGlobe} className="text-h2 text-bright-salmon" />
);
const phoneIcon = (
  <FontAwesomeIcon icon={faPhone} className="text-body-sm text-salmon" />
);
const locationIcon = (
  <FontAwesomeIcon icon={faLocationDot} className="text-body-sm text-salmon" />
);

const SearchResultCard = memo(
  ({ result }: { result: searchResultPlacesType }) => {
    const checkTouchDevice = isTouchDevice();

    const Wrapper = result?.webUrl && !checkTouchDevice ? "a" : "div";
    const wrapperProps =
      result?.webUrl && !checkTouchDevice ? { href: result.webUrl } : {};

    const phoneNumber =
      result?.phone !== undefined ? parsePhoneNumber(result?.phone, "US") : "";
    const formattedPhone = phoneNumber ? phoneNumber.formatNational() : "N/A";
    return (
      <Wrapper
        {...wrapperProps}
        data-testid="card-wrapper"
        target="_blank"
        rel="noopener noreferrer"
        className={`relative bg-white text-left flex flex-wrap items-stretch col-start-1 col-span-12 even:md:col-start-7 odd:md:col-start-2 md:col-span-5 even:lg:col-start-7 odd:lg:col-start-3 lg:col-span-4 w-full font-akatab mb-4 card-bg transition-all duration-300 ease-in-out shadow-card hover:shadow-card-lg border-2 border-white hover:border-white rounded-lg p-5`}
      >
        <section className="flex flex-wrap w-full relative">
          <span className="flex justify-between items-start w-full">
            <h2 className="text-gradient text-h2 leading-h2 font-black mb-4">
              {result?.name}
            </h2>
            <span className="ml-2">
              {checkTouchDevice && result?.webUrl ? (
                <button
                  aria-label="Website link"
                  role="button"
                  onClick={() => window.open(result.webUrl, "_blank")}
                >
                  {webIcon}
                </button>
              ) : result.webUrl ? (
                webIcon
              ) : (
                ""
              )}
            </span>
          </span>
          {result?.address && (
            <p
              data-testid="card-address"
              className="text-body leading-body mb-2"
            >
              <span
                data-testid="address-icon"
                className="absolute w-[18px] h-[18px]"
              >
                {locationIcon}
              </span>
              <span className="inline-block pl-6">{result?.address}</span>
            </p>
          )}
          <p
            data-testid="card-phone"
            className="block w-full text-body leading-body"
          >
            <span className="absolute w-[18px] h-[18px]">{phoneIcon}</span>
            <span className="inline-block pl-6">{formattedPhone}</span>
          </p>
        </section>
        {result.rating && (
          <span
            data-testid="card-rating"
            className="relative flex justify-end items-end w-full mt-2"
          >
            <Ratings rating={result.rating} />
            <InfoBox
              isTouch={checkTouchDevice}
              rating={result.rating}
              ratingCount={result?.ratingCount}
            />
          </span>
        )}
      </Wrapper>
    );
  },
);

export { SearchResultCard };
