import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const InfoBox = ({
  isTouch,
  rating,
  ratingCount,
}: {
  isTouch: boolean;
  rating: string;
  ratingCount: number | undefined;
}) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {showPopup && (
        <div className="absolute popup bottom-[30px] right-0 popup bg-bright-salmon rounded-sm p-3 w-[180px] shadow-lg z-20">
          <p className="leading-5 text-[16px] text-white">
            Rated <span className="font-black">{rating}</span> out of 5 based on
            a total of {ratingCount} ratings.
          </p>
        </div>
      )}
      <button
        className="info-box"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowPopup((prev) => !prev);
        }}
        onMouseEnter={() => (isTouch ? "" : setShowPopup(true))}
        onMouseLeave={() => (isTouch ? "" : setShowPopup(false))}
      >
        <FontAwesomeIcon
          icon={faCircleInfo}
          className={`text-4 px-1 mt-0 shadow-lg ${showPopup && !isTouch ? "text-white" : "text-dark-blue"}`}
        />
      </button>
    </>
  );
};

export { InfoBox };
