import { StarIconFilled, StarIconOutline } from "../icons/Star";

const Ratings = ({ rating }: { rating: number | string }) => {
  if (typeof rating !== "number" || rating < 0) return;
  const totalStars = 5;
  const fillPercent = (rating / totalStars) * 100;

  return (
    <div
      className="relative inline-flex items-end w-fit"
      role="img"
      aria-label={`Rating: ${rating} out of ${totalStars} stars`}
      data-testid="ratings-wrapper"
    >
      {/* Display the empty 5 stars */}
      {Array.from({ length: totalStars }, (_, index) => {
        return (
          <div
            data-testid="star-outline"
            key={`base-${index}`}
            className="text-salmon flex space-x-1"
          >
            <StarIconOutline key={`outline-${index}`} />
          </div>
        );
      })}

      <span
        data-testid="star-filled-wrapper"
        className={`absolute flex overflow-hidden text-transparent`}
        style={{
          width: `${fillPercent}%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {Array.from({ length: totalStars }).map((_, index) => (
          <span
            data-testid="star-filled"
            aria-hidden="true"
            key={`filled-${index}`}
            className="text-bright-salmon flex space-x-1"
          >
            <StarIconFilled key={`fill-${index}`} />
          </span>
        ))}
      </span>
    </div>
  );
};

export { Ratings };
