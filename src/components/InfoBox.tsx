import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const InfoBox = ({
  rating,
  ratingCount,
}: {
  rating: number;
  ratingCount: number;
}) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      {showPopup && (
        <div className="absolute popup bottom-[30px] right-0 popup bg-bright-salmon rounded-sm p-3 w-[180px] shadow-lg">
          <p className="leading-5 text-[16px] text-white">
            Rated <span className="font-black">{rating}</span> out of 5 based on
            a total of {ratingCount} ratings.
          </p>
        </div>
      )}
      <div
        onClick={() => setShowPopup((prev) => !prev)}
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
      >
        <FontAwesomeIcon
          icon={faCircleInfo}
          className={`text-4 ml-1 mt-0 shadow-lg ${showPopup ? "text-white" : "text-dark-blue"}`}
        />
      </div>
    </>
  );
};

export { InfoBox };
