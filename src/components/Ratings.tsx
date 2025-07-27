import { StarIconFilled, StarIconOutline } from "../icons/Star";

const Ratings = ({ rating }: { rating: number | string }) => {
  if (typeof rating !== "number") return;
  const totalStars = 5;
  const fillPercent = (rating / totalStars) * 100;

  return (
    <div className="relative inline-flex items-end  w-fit">
      {/* Display the empty 5 stars */}
      {Array.from({ length: totalStars }, (_, index) => {
        return (
          <div className="text-salmon flex space-x-1">
            <StarIconOutline key={`outline-${index}`} />
          </div>
        );
      })}

      <div
        className={`absolute flex overflow-hidden text-transparent`}
        style={{
          width: `${fillPercent}%`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
        }}
      >
        {Array.from({ length: totalStars }).map((_, index) => (
          <div className="text-bright-salmon flex space-x-1">
            <StarIconFilled key={`fill-${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { Ratings };
