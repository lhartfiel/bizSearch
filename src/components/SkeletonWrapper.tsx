import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { PropsWithChildren, useId } from "react";
import "react-loading-skeleton/dist/skeleton.css";

function Box({ children }: PropsWithChildren<unknown>) {
  return (
    <div
      style={{
        borderRadius: "8px",
        display: "flex flex-wrap",
        lineHeight: 1,
        marginBottom: "0.5rem",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

const skeletonData = [
  {
    name: "title",
    height: 16,
    customClass: "mb-4 w-full",
    count: 1,
  },
  {
    name: "body",
    height: 11,
    customClass: "flex-wrap w-full mb-2",
    count: 2,
  },
  {
    name: "stars",
    height: 11,
    customClass: "mr-0 ml-auto w-1/3 mt-3",
    count: 1,
  },
];

const SkeletonWrapper = () => {
  return (
    <div className="col-start-1 col-span-12 even:md:col-start-7 odd:md:col-start-2 md:col-span-5 even:lg:col-start-7 odd:lg:col-start-3 lg:col-span-4 w-full rounded-lg bg-white mb-4 p-5 shadow-card">
      <SkeletonTheme duration={2} height={12}>
        <Box>
          {skeletonData.map((skeleton, idx) => {
            return (
              <Skeleton
                key={`${skeleton.name}-${idx}`}
                height={skeleton.height}
                baseColor="#d1d5db"
                highlightColor="#9ca3af"
                containerClassName={`flex ${skeleton.customClass}`}
                count={skeleton.count}
              />
            );
          })}
        </Box>
      </SkeletonTheme>
    </div>
  );
};

export { SkeletonWrapper };
