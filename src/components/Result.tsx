import parsePhoneNumber, { parse } from "libphonenumber-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { Ratings } from "./Ratings";
import { InfoBox } from "./Infobox";

const webIcon = (
  <FontAwesomeIcon icon={faGlobe} className="text-h2 text-bright-salmon" />
);

const Result = ({ result, index }) => {
  const Wrapper = result?.webUrl ? "a" : "div";
  const wrapperProps = result?.webUrl ? { href: result.webUrl } : {};

  const phoneNumber =
    result?.phone !== undefined ? parsePhoneNumber(result?.phone, "US") : "";
  const formattedPhone = phoneNumber ? phoneNumber.formatNational() : "N/A";
  return (
    <Wrapper
      {...wrapperProps}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-left flex flex-wrap items-stretch col-start-1 col-span-12 even:md:col-start-7 odd:md:col-start-2 md:col-span-5 even:lg:col-start-7 odd:lg:col-start-3 lg:col-span-4 w-full font-akatab mb-4 bg-white hover:bg-[image:var(--bg-linear-gradient-light)] transition-border duration-300 ease-in-out shadow-card hover:shadow-2xl border-2 border-white hover:border-white rounded-lg p-5`}
    >
      <section className="flex flex-wrap w-full">
        <span className="flex justify-between items-start w-full">
          <h2 className="text-gradient text-h2 leading-h2 font-black mb-2">
            {result?.name}
          </h2>
          {result?.webUrl && webIcon}
        </span>
        {result?.address && (
          <p className="text-body leading-body">{result?.address}</p>
        )}
        <p>Phone: {formattedPhone}</p>
      </section>
      {result.rating && (
        <span className="relative flex justify-end items-end w-full mt-2">
          <Ratings rating={result.rating} />
          <InfoBox rating={result.rating} ratingCount={result.ratingCount} />
        </span>
      )}
    </Wrapper>
  );
};

export { Result };
