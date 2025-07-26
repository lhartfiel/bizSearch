import parsePhoneNumber, { parse } from "libphonenumber-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

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
      className={`text-left col-start-1 col-span-12 even:md:col-start-7 odd:md:col-start-2 md:col-span-5 even:lg:col-start-7 odd:lg:col-start-3 lg:col-span-4 w-full font-akatab mb-4 bg-white hover:bg-[image:var(--bg-linear-gradient-light)] transition-border duration-300 ease-in-out shadow-card hover:shadow-2xl border-2 border-white hover:border-white rounded-lg p-5`}
    >
      <span className="flex justify-between items-center">
        <h2 className="text-bright-salmon text-h2 font-black">
          {result?.name}
        </h2>
        {result?.webUrl && webIcon}
      </span>
      {result?.address && (
        <p className="text-body leading-body">{result?.address}</p>
      )}
      <p>Phone: {formattedPhone}</p>
      <h3>Rating: {result.rating ? result.rating : "N/A"}</h3>
    </Wrapper>
  );
};

export { Result };
