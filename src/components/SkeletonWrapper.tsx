import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { PropsWithChildren, useId } from "react";
import "react-loading-skeleton/dist/skeleton.css";

function Box({ children }: PropsWithChildren<unknown>) {
  return (
    <div
      style={{
        borderRadius: "8px",
        display: "flex",
        lineHeight: 1,
        marginBottom: "0.5rem",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}

const SkeletonWrapper = () => {
  return (
    <div className="even:lg:col-start-7 odd:lg:col-start-3 lg:col-span-4 w-full rounded-lg bg-white mb-4 p-5 shadow-card">
      <SkeletonTheme duration={2} height={12}>
        <Box>
          <Skeleton
            height={10}
            baseColor="#d1d5db"
            highlightColor="#9ca3af"
            containerClassName="flex-1"
            count={4}
            className="flex mb-2"
          />
        </Box>
      </SkeletonTheme>
    </div>
  );
};

export { SkeletonWrapper };
